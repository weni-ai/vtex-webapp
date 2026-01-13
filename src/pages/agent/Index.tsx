import { Alert, Bleed, Button, Divider, Field, FieldDescription, FieldError, Flex, IconArrowLeft, IconButton, IconPlus, Input, Label, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Skeleton, Tab, TabList, TabPanel, TabProvider, Text, Textarea, toast, useTabStore } from '@vtex/shoreline';
import { useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { InputCopyToClipboard } from '../../components/InputCopyToClipboard';
import { TemplateCard, TemplateCardContainer, TemplateCardSkeleton } from '../../components/TemplateCard';
import { AgentDescriptiveStatus } from '../../components/agent/DescriptiveStatus';
import { PublishModal } from '../../components/agent/modals/Publish';
import { SwitchToTestModeModal } from '../../components/agent/modals/SwitchToTestMode';
import { agentCLI, updateAgentGlobalRule } from '../../services/agent.service';
import store from '../../store/provider.store';
import { ProcessModal } from '../template/modals/Process';
import { useTranslation } from 'react-i18next';
import { Tag } from '../../components/adapters/Tag';
import { AgentTemplateDeliveredOrderProvider, useAgentTemplateDeliveredOrderContext } from './AgentTemplateDeliveredOrderContext';

import './Index.style.css';

interface AbandonedCartConfig {
  abandonmentTimeMinutes: number;
  minimumCartValue: number;
  headerImageType: 'first_item' | 'most_expensive';
}

export interface Template {
  uuid: string;
  name: string;
  description: string;
  status: 'active' | 'rejected' | 'pending' | 'needs-editing';
}

function TemplateList({ navigateToCreateTemplate, templates, isLoading, loadAgentDetails, canManageTemplates = true }: { navigateToCreateTemplate: () => void, templates: Template[], isLoading: boolean, loadAgentDetails: () => void, canManageTemplates?: boolean }) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-5">
      <Flex gap="$space-5" align="center" justify="space-between">
        <Flex direction="column" gap="$space-1">
          <Text variant="display2" color="$fg-base">{t('template.list.title')}</Text>
          <Text variant="body" color="$fg-base">{t('template.list.description')}</Text>
        </Flex>

        {canManageTemplates && (
          <Button variant="secondary" size="large" onClick={navigateToCreateTemplate} data-testid="create-custom-template-button">
          <IconPlus />
            {t('template.buttons.add')}
          </Button>
        )}
      </Flex>

      <TemplateCardContainer>
        {isLoading && (
          <TemplateCardSkeleton count={3} />
        )}

        {templates.map((template, index) => (
          <TemplateCard 
            key={index} 
            {...template} 
            loadAgentDetails={loadAgentDetails} 
            hasMenuOptions={canManageTemplates} 
          />
        ))}
      </TemplateCardContainer>
    </Flex>
  )
}

function Settings({ isLoading, webhookUrl, contactPercentage, loadAgentDetails, previousGlobalRule, isSimplifiedView, abandonedCartConfig }: { isLoading: boolean, webhookUrl: string, contactPercentage: number | undefined, loadAgentDetails: () => void, previousGlobalRule: string, isSimplifiedView: boolean, abandonedCartConfig?: AbandonedCartConfig }) {
  const { t } = useTranslation();

  const { assignedAgentUuid } = useParams();
  const [percentage, setPercentage] = useState<string>('');
  const [globalRule, setGlobalRule] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');
  
  const [abandonedCartConfigState, setAbandonedCartConfigState] = useState<AbandonedCartConfig | undefined>(abandonedCartConfig);

  useEffect(() => {
    setAbandonedCartConfigState(abandonedCartConfig);
  }, [abandonedCartConfig]);

  useEffect(() => {
    if (contactPercentage) {
      setPercentage(contactPercentage.toString());
    } else {
      setPercentage('');
    }

    if (previousGlobalRule) {
      setGlobalRule(previousGlobalRule);
    }
  }, [contactPercentage, previousGlobalRule]);

  function handlePercentageChange(value: string) {
    if (Number(value) > 100) {
      setPercentage('100');
    } else {
      setPercentage(value.replace(/\D/g, ''));
    }
  }

  function handlePercentageBlur(value: string) {
    let valueToSave = value;

    if (Number(value) > 100) {
      valueToSave = '100';
    } else if (Number(value) < 1) {
      valueToSave = '1';
    }

    setPercentage(Number(valueToSave).toFixed());
  }

  const hasPercentageChanged = useMemo(() => {
    return contactPercentage !== Number(percentage);
  }, [contactPercentage, percentage]);

  const hasGlobalRuleChanged = useMemo(() => {
    return previousGlobalRule !== globalRule;
  }, [previousGlobalRule, globalRule]);

  const hasAbandonedCartConfigChanged = useMemo(() => {
    return abandonedCartConfigState?.minimumCartValue !== abandonedCartConfig?.minimumCartValue
    || abandonedCartConfigState?.abandonmentTimeMinutes !== abandonedCartConfig?.abandonmentTimeMinutes;
  }, [abandonedCartConfigState, abandonedCartConfig]);

  const hasAbandonedCartAbandonmentTimeMinutesError = useMemo(() => {
    return isSimplifiedView && (abandonedCartConfigState?.abandonmentTimeMinutes || 0) < 20;
  }, [abandonedCartConfigState?.abandonmentTimeMinutes]);

  async function handleSave() {
    setSuccessText('');
    setErrorText('');

    try {
      setIsSaving(true);

      if (hasGlobalRuleChanged) {
        setIsProcessModalOpen(true);
      }

      await updateAgentGlobalRule({
        agentUuid: assignedAgentUuid as string,
        globalRule: hasGlobalRuleChanged ? globalRule : undefined,
        contactPercentage: hasPercentageChanged ? Number(percentage) : undefined,
        abandonedCartAbandonmentTimeMinutes: hasAbandonedCartConfigChanged ? abandonedCartConfigState?.abandonmentTimeMinutes : undefined,
        abandonedCartMinimumCartValue: hasAbandonedCartConfigChanged ? abandonedCartConfigState?.minimumCartValue : undefined,
      });

      if (hasGlobalRuleChanged) {
        setSuccessText(t('agents.details.settings.actions.save.success'));
      } else {
        toast.success(t('agents.details.settings.actions.save.success'));
      }

      loadAgentDetails();
    } catch (error) {
      setPercentage(contactPercentage?.toString() || '');

      if (hasGlobalRuleChanged) {
        setErrorText((error as Error).message);
      } else {
        toast.critical((error as Error).message);
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleAbandonedCartConfigChange(key: 'minimumCartValue' | 'abandonmentTimeMinutes', value: string) {
    setAbandonedCartConfigState({
      headerImageType: abandonedCartConfigState?.headerImageType || 'first_item',
      abandonmentTimeMinutes: abandonedCartConfigState?.abandonmentTimeMinutes || 0,
      minimumCartValue: abandonedCartConfigState?.minimumCartValue || 0,
      [key]: Number(value) || 0,
    });
  }

  return (
    <Flex direction="column" gap="$space-5">
      {errorText && <Alert variant="critical" data-testid="error-alert">
        <Text variant="body">
          <Markdown>{errorText}</Markdown>
        </Text>
      </Alert>}

      {!isSimplifiedView && (
        <InputCopyToClipboard
          isLoading={isLoading}
          label={t('agents.details.settings.fields.webhook_url.label')}
          prefix="URL"
          value={webhookUrl}
          description={t('agents.details.settings.fields.webhook_url.description')}
          successMessage={t('common.url_copied')}
          testId="webhook-url-input"
        />
      )}

      <Field>
        <Label>{t('agent.modals.publish.fields.percentage.title')}</Label>

        {isLoading ? (
          <Skeleton style={{ width: '100%', height: '44px' }} />
        ) : (
          <Input
            type="number"
            value={percentage}
            onChange={handlePercentageChange}
            onBlur={(e) => handlePercentageBlur(e.target.value)}
            suffix="%"
            data-testid="contact-percentage-input"
          />
        )}

        <FieldDescription>{t('agent.modals.publish.fields.percentage.description')}</FieldDescription>
      </Field>

      {!isSimplifiedView && (
        <Field>
          <Label>{t('agents.details.settings.fields.global_rule.label')}</Label>

          {isLoading ? (
            <Skeleton style={{ width: '100%', height: '68px' }} />
          ) : (
            <Textarea
              className="content-textarea-full-width"
              value={globalRule}
              onChange={setGlobalRule}
              data-testid="global-rule-textarea"
            />
          )}

          <FieldDescription>{t('agents.details.settings.fields.global_rule.description')}</FieldDescription>
        </Field>
      )}

      {isSimplifiedView && (
        <>
          <Field>
            <Label>{t('agents.details.settings.fields.abandoned_cart.minimum_cart_value.label')}</Label>

            {isLoading ? (
              <Skeleton style={{ width: '100%', height: '44px' }} />
            ) : (
              <Input
                type="number"
                value={abandonedCartConfigState?.minimumCartValue.toString() || ''}
                prefix="R$"
                onChange={(value) => handleAbandonedCartConfigChange('minimumCartValue', value)}
                data-testid="abandoned-cart-minimum-cart-value-input"
              />
            )}
          </Field>

          <Field error={hasAbandonedCartAbandonmentTimeMinutesError}>
            <Label>{t('agents.details.settings.fields.abandoned_cart.abandonment_time_minutes.label')}</Label>

            {isLoading ? (
              <Skeleton style={{ width: '100%', height: '44px' }} />
            ) : (
              <Input
                type="number"
                value={abandonedCartConfigState?.abandonmentTimeMinutes.toString() || ''}
                onChange={(value) => handleAbandonedCartConfigChange('abandonmentTimeMinutes', value)}
                data-testid="abandoned-cart-abandonment-time-minutes-input"
              />
            )}

            {hasAbandonedCartAbandonmentTimeMinutesError && <FieldError>{t('agents.details.settings.fields.abandoned_cart.abandonment_time_minutes.errors.min')}</FieldError>}
          </Field>
        </>
      )}

      <Flex justify="end">
        <Button
          variant="primary"
          size="large"
          disabled={(!hasPercentageChanged && !hasGlobalRuleChanged && !hasAbandonedCartConfigChanged) || hasAbandonedCartAbandonmentTimeMinutesError}
          onClick={handleSave}
          loading={isSaving}
          data-testid="save-settings-button"
        >
          {t('agents.details.settings.buttons.save')}
        </Button>
      </Flex>

      <ProcessModal
        open={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        processingText={t('agents.details.settings.steps.processing.description')}
        steps={[
          'analyzing_defined_requirements',
          'reviewing_rule_structure',
          'validating_inserted_content',
          'optimizing_rule_for_fast_delivery',
          'performing_final_security_checks',
        ]}
        errorText={errorText}
        successText={successText}
      />
    </Flex>
  )
}

function DeliveredOrderTab({
  isLoading,
  assignedAgentUuid,
  isEnabledFromFather,
  appKeyFromFather,
}: {
  isLoading: boolean;
  assignedAgentUuid: string;
  isEnabledFromFather: boolean;
  appKeyFromFather: string;
}) {
  const {
    isEnabled, setIsEnabled,
    appKey, setAppKey,
    appToken, setAppToken,
    enable, isEnabling,
    disable, isDisabling,
  } = useAgentTemplateDeliveredOrderContext();

  const { t } = useTranslation();

  useEffect(() => {
    if (isEnabledFromFather) {
      setIsEnabled(isEnabledFromFather);
    }
  }, [isEnabledFromFather]);

  useEffect(() => {
    if (appKeyFromFather) {
      setAppKey(appKeyFromFather);
    }
  }, [appKeyFromFather]);

  return (
    <Flex direction="column" gap="$space-5">
      <Field>
        <Label>{t('agents.details.delivered_order_tracking.fields.app_key.label')}</Label>

        {isLoading ? (
          <Skeleton style={{ width: '100%', height: '44px' }} />
        ) : (
          <Input
            disabled={isEnabled}
            value={appKey}
            onChange={setAppKey}
            data-testid="app-key-input"
          />
        )}
      </Field>

      {!isEnabled && (
        <Field>
          <Label>{t('agents.details.delivered_order_tracking.fields.app_token.label')}</Label>

          {isLoading ? (
            <Skeleton style={{ width: '100%', height: '44px' }} />
          ) : (
            <Input
              type="password"
              value={appToken}
              onChange={setAppToken}
              data-testid="app-token-input"
            />
          )}
        </Field>
      )}

      <Flex justify="end">
        {isEnabled ? (
          <Button
            variant="critical"
            size="large"
            onClick={() => disable(assignedAgentUuid)}
            loading={isDisabling}
            data-testid="disable-delivered-order-tracking-button"
          >
            {t('agents.details.delivered_order_tracking.buttons.disable')}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="large"
            disabled={!appKey || !appToken}
            onClick={() => enable(assignedAgentUuid)}
            loading={isEnabling}
            data-testid="enable-delivered-order-tracking-button"
          >
            {t('agents.details.delivered_order_tracking.buttons.enable')}
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export function AgentIndex() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { assignedAgentUuid } = useParams();

  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [_agentStatus, setAgentStatus] = useState<'test' | 'production'>('test');

  const [hasDeliveredOrderTemplate, setHasDeliveredOrderTemplate] = useState(false);
  const [isDeliveredOrderTrackingEnabled, setIsDeliveredOrderTrackingEnabled] = useState(false);
  const [deliveredOrderAppKey, setDeliveredOrderAppKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [abandonedCartConfig, setAbandonedCartConfig] = useState<AbandonedCartConfig | undefined>(undefined);
  const [contactPercentage, setContactPercentage] = useState<number | undefined>(undefined);
  const [agentGlobalRule, setAgentGlobalRule] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);

  const [isSwitchToTestModeModalOpen, setIsSwitchToTestModeModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [updateTemplatesTimeout, setUpdateTemplatesTimeout] = useState<NodeJS.Timeout | null>(null);

  const [isAbandonedCart, setIsAbandonedCart] = useState(false);

  const tabStore = useTabStore();

  useEffect(() => {
    index();
  }, []);

  useEffect(() => {
    if (updateTemplatesTimeout) {
      clearTimeout(updateTemplatesTimeout);
    }

    const timeout = setTimeout(verifyPendingTemplates, 5000);

    setUpdateTemplatesTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    }
  }, [templates]);

  async function index() {
    const agent = store.getState().project.agents
      .filter((agent) => agent.origin === 'CLI')
      .find((agent) => agent.assignedAgentUuid === assignedAgentUuid);

    if (!agent) {
      return;
    }

    setAgentName(agent.name);
    setAgentDescription(agent.description);
    loadAgentDetails();
  }

  async function loadAgentDetails({ forceUpdate = false }: { forceUpdate?: boolean } = {}) {
    try {
      if (!forceUpdate) {
        setIsLoading(true);
      }

      const response = await agentCLI({ agentUuid: assignedAgentUuid as string, forceUpdate });

      setHasDeliveredOrderTemplate(response.hasDeliveredOrderTemplates);
      setIsDeliveredOrderTrackingEnabled(response.deliveredOrderTrackingConfig.isEnabled);
      setDeliveredOrderAppKey(response.deliveredOrderTrackingConfig.appKey);
      const isAbandonedCart = response.templates.at(0)?.name.toLowerCase() === 'abandoned cart' && response.templates.length === 1;

      setIsAbandonedCart(isAbandonedCart);

      setWebhookUrl(response.webhookUrl);
      setContactPercentage(response.contactPercentage);
      setAgentGlobalRule(response.globalRule || '');

      if (response.abandonedCartAbandonmentTimeMinutes || response.abandonedCartMinimumCartValue || response.abandonedCartHeaderImageType) {
        setAbandonedCartConfig({
          abandonmentTimeMinutes: response.abandonedCartAbandonmentTimeMinutes || 0,
          minimumCartValue: response.abandonedCartMinimumCartValue || 0,
          headerImageType: {
            'first_item': 'first_item' as const,
            'most_expensive': 'most_expensive' as const,
          }[response.abandonedCartHeaderImageType as 'first_item' | 'most_expensive'] || 'first_image' as const
        });
      }

      const templates = response.templates.filter(({ status }) => ['active', 'pending', 'rejected', 'needs-editing'].includes(status));

      setTemplates(templates.map(({ uuid, name, status, metadata }) => ({
        uuid,
        name,
        description: metadata.body,
        status: status as 'active' | 'pending' | 'rejected' | 'needs-editing',
      })));
    } catch (error) {
      toast.critical(t('common.errors.unexpected_error'));
    } finally {
      setIsLoading(false);
    }
  }

  function verifyPendingTemplates() {
    const pendingTemplates = templates.filter(({ status }) => status === 'pending');

    if (pendingTemplates.length > 0) {
      loadAgentDetails({ forceUpdate: true }).catch(console.error);
    }
  }

  function navigateToCreateTemplate() {
    navigate(`/agents/${assignedAgentUuid}/templates/create`);
  }

  function handlePublish() {
    setAgentStatus('production');
    toast.success(t('agent.actions.publish.success', { agentName }));
  }

  function handleTest() {
    setAgentStatus('test');
    toast.success(t('agent.actions.switch_to_test.success', { agentName }));
  }

  return (
    <AgentTemplateDeliveredOrderProvider isEnabled={isDeliveredOrderTrackingEnabled} setIsEnabled={setIsDeliveredOrderTrackingEnabled}>
      <Page>
        <PageHeader>
          <PageHeaderRow>
            <Flex align="center">
              <Bleed top="$space-2" bottom="$space-2">
                <IconButton
                  label={t('common.return')}
                  asChild
                  variant="tertiary"
                  size="large"
                  onClick={() => navigate('/dash')}
                  data-testid="back-button"
                >
                  <IconArrowLeft />
                </IconButton>
              </Bleed>

              <PageHeading>{agentName}</PageHeading>
            </Flex>
          </PageHeaderRow>
        </PageHeader>

        <PageContent>
          <TabProvider store={tabStore}>
            <TabList>
              <Tab id={'about'}>
                {t('agents.details.about.title')}
              </Tab>

              <Tab id={'settings'}>{t('agents.details.settings.title')}</Tab>

              {hasDeliveredOrderTemplate && (
                <Tab id={'delivered-order-tracking'}>
                  <Flex align="center" gap="$space-2">
                    {t('agents.details.delivered_order_tracking.title')}

                    {isDeliveredOrderTrackingEnabled ? (
                      <Tag color="blue" variant="secondary">
                        {t('agents.details.delivered_order_tracking.status.enabled')}
                      </Tag>
                    ) : (
                      <Tag color="purple" variant="secondary">
                        {t('agents.details.delivered_order_tracking.status.disabled')}
                      </Tag>
                    )}
                  </Flex>
                </Tab>
              )}
            </TabList>

            <TabPanel tabId={'about'}>
              <Flex direction="column" gap="$space-8">
                <Flex direction="column" gap="$space-5">
                  <Text variant="body">
                    {agentDescription}
                  </Text>

                  <AgentDescriptiveStatus status={'integrated'} showLabel={true} />
                </Flex>
                <Divider />
                <TemplateList
                  navigateToCreateTemplate={navigateToCreateTemplate}
                  templates={templates}
                  isLoading={isLoading}
                  loadAgentDetails={loadAgentDetails}
                  canManageTemplates={!isAbandonedCart}
                />              
              </Flex>
            </TabPanel>

            <TabPanel tabId={'settings'}>
              <Settings
                isLoading={isLoading}
                webhookUrl={webhookUrl}
                contactPercentage={contactPercentage}
                loadAgentDetails={loadAgentDetails}
                previousGlobalRule={agentGlobalRule}
                abandonedCartConfig={abandonedCartConfig}
                isSimplifiedView={isAbandonedCart}
              />
            </TabPanel>

            <TabPanel tabId={'delivered-order-tracking'}>
              <DeliveredOrderTab
                isLoading={isLoading}
                assignedAgentUuid={assignedAgentUuid as string}
                isEnabledFromFather={isDeliveredOrderTrackingEnabled}
                appKeyFromFather={deliveredOrderAppKey}
              />
            </TabPanel>
          </TabProvider>

          {false && <SwitchToTestModeModal
            open={isSwitchToTestModeModalOpen}
            onClose={() => setIsSwitchToTestModeModalOpen(false)}
            onTest={handleTest}
          />}

          {false && <PublishModal
            open={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            onPublish={handlePublish}
          />}
        </PageContent>
      </Page>
    </AgentTemplateDeliveredOrderProvider>
  )
}
