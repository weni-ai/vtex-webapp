import { Alert, Bleed, Button, Divider, Field, FieldDescription, Flex, IconArrowLeft, IconButton, IconPlus, Input, Label, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Skeleton, Tab, TabList, TabPanel, TabProvider, Text, Textarea, toast } from '@vtex/shoreline';
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

export interface Template {
  uuid: string;
  name: string;
  description: string;
  status: 'active' | 'rejected' | 'pending' | 'needs-editing';
}

function TemplateList({ navigateToCreateTemplate, templates, isLoading, loadAgentDetails }: { navigateToCreateTemplate: () => void, templates: Template[], isLoading: boolean, loadAgentDetails: () => void }) {
  return (
    <Flex direction="column" gap="$space-5">
      <Flex gap="$space-5" align="center" justify="space-between">
        <Flex direction="column" gap="$space-1">
          <Text variant="display2" color="$fg-base">{t('template.list.title')}</Text>
          <Text variant="body" color="$fg-base">{t('template.list.description')}</Text>
        </Flex>

        <Button variant="secondary" size="large" onClick={navigateToCreateTemplate}>
          <IconPlus />
          {t('template.buttons.add')}
        </Button>
      </Flex>

      <TemplateCardContainer>
        {isLoading && (
          <TemplateCardSkeleton count={3} />
        )}

        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} loadAgentDetails={loadAgentDetails} />
        ))}
      </TemplateCardContainer>
    </Flex>
  )
}

function Settings({ isLoading, webhookUrl, contactPercentage, loadAgentDetails, previousGlobalRule }: { isLoading: boolean, webhookUrl: string, contactPercentage: number | undefined, loadAgentDetails: () => void, previousGlobalRule: string }) {
  const { assignedAgentUuid } = useParams();
  const [percentage, setPercentage] = useState<string | undefined>(undefined);
  const [globalRule, setGlobalRule] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (contactPercentage) {
      setPercentage(contactPercentage.toString());
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
      });

      if (hasGlobalRuleChanged) {
        setSuccessText(t('agents.details.settings.actions.save.success'));
      } else {
        toast.success(t('agents.details.settings.actions.save.success'));
      }

      loadAgentDetails();
    } catch (error) {
      setPercentage(contactPercentage?.toString());

      if (hasGlobalRuleChanged) {
        setErrorText((error as Error).message);
      } else {
        toast.critical((error as Error).message);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Flex direction="column" gap="$space-5">
      {errorText && <Alert variant="critical">
        <Text variant="body">
          <Markdown>{errorText}</Markdown>
        </Text>
      </Alert>}

      <InputCopyToClipboard
        isLoading={isLoading}
        label={t('agents.details.settings.fields.webhook_url.label')}
        prefix="URL"
        value={webhookUrl}
        description={t('agents.details.settings.fields.webhook_url.description')}
        successMessage={t('common.url_copied')}
      />

      <Field>
        <Label>{t('agent.modals.publish.fields.percentage.title')}</Label>

        {isLoading ? (
          <Skeleton style={{ width: '100%', height: '44px' }} />
        ) : (
          <Input type="number" value={percentage} onChange={handlePercentageChange} onBlur={(e) => handlePercentageBlur(e.target.value)} suffix="%" />
        )}

        <FieldDescription>{t('agent.modals.publish.fields.percentage.description')}</FieldDescription>
      </Field>

      <Field>
        <Label>{t('agents.details.settings.fields.global_rule.label')}</Label>

        {isLoading ? (
          <Skeleton style={{ width: '100%', height: '68px' }} />
        ) : (
          <Textarea
            className="content-textarea-full-width"
            value={globalRule}
            onChange={setGlobalRule}
          />
        )}

        <FieldDescription>{t('agents.details.settings.fields.global_rule.description')}</FieldDescription>
      </Field>

      <Flex justify="end">
        <Button
          variant="primary"
          size="large"
          disabled={!hasPercentageChanged && !hasGlobalRuleChanged}
          onClick={handleSave}
          loading={isSaving}
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

export function AgentIndex() {
  const navigate = useNavigate();
  const { assignedAgentUuid } = useParams();

  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [_agentStatus, setAgentStatus] = useState<'test' | 'production'>('test');

  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [contactPercentage, setContactPercentage] = useState<number | undefined>(undefined);
  const [agentGlobalRule, setAgentGlobalRule] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);

  const [isSwitchToTestModeModalOpen, setIsSwitchToTestModeModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [updateTemplatesTimeout, setUpdateTemplatesTimeout] = useState<NodeJS.Timeout | null>(null);

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
    if (!assignedAgentUuid) {
      return;
    }

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
    if (!assignedAgentUuid) {
      return;
    }

    try {
      if (!forceUpdate) {
        setIsLoading(true);
      }

      const response = await agentCLI({ agentUuid: assignedAgentUuid, forceUpdate });

      setWebhookUrl(response.webhookUrl);
      setContactPercentage(response.contactPercentage);
      setAgentGlobalRule(response.globalRule || '');

      const templates = response.templates.filter(({ status }) => ['active', 'pending', 'rejected', 'needs-editing'].includes(status));

      setTemplates(templates.map(({ uuid, name, status, metadata }) => ({
        uuid,
        name,
        description: metadata.body,
        status: status as 'active' | 'pending' | 'rejected' | 'needs-editing',
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyPendingTemplates() {
    const pendingTemplates = templates.filter(({ status }) => status === 'pending');

    if (pendingTemplates.length > 0) {
      await loadAgentDetails({ forceUpdate: true });
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
              >
                <IconArrowLeft />
              </IconButton>
            </Bleed>

            <PageHeading>{agentName}</PageHeading>
          </Flex>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <TabProvider>
          <TabList>
            <Tab>{t('agents.details.about.title')}</Tab>
            <Tab>{t('agents.details.settings.title')}</Tab>
          </TabList>

          <TabPanel>
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
              />
            </Flex>
          </TabPanel>

          <TabPanel>
            <Settings
              isLoading={isLoading}
              webhookUrl={webhookUrl}
              contactPercentage={contactPercentage}
              loadAgentDetails={loadAgentDetails}
              previousGlobalRule={agentGlobalRule}
            />
          </TabPanel>
        </TabProvider>

        <SwitchToTestModeModal
          open={isSwitchToTestModeModalOpen}
          onClose={() => setIsSwitchToTestModeModalOpen(false)}
          onTest={handleTest}
        />

        <PublishModal
          open={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublish={handlePublish}
        />
      </PageContent>
    </Page>
  )
}
