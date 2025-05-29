import { Bleed, Button, Divider, Field, FieldDescription, Flex, IconArrowLeft, IconButton, IconCopySimple, IconPlus, Input, Label, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Skeleton, Tab, TabList, TabPanel, TabProvider, Text, toast } from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateCard, TemplateCardContainer, TemplateCardSkeleton } from '../../components/TemplateCard';
import { AgentDescriptiveStatus } from '../../components/agent/DescriptiveStatus';
import { PublishModal } from '../../components/agent/modals/Publish';
import { SwitchToTestModeModal } from '../../components/agent/modals/SwitchToTestMode';
import { agentCLI } from '../../services/agent.service';
import store from '../../store/provider.store';

export interface Template {
  uuid: string;
  name: string;
  description: string;
  status: 'active' | 'rejected' | 'pending' | 'needs-editing';
}

function TemplateList({ navigateToCreateTemplate, templates, isLoading }: { navigateToCreateTemplate: () => void, templates: Template[], isLoading: boolean }) {
  return (
    <Flex direction="column" gap="$space-5">
      <Flex gap="$space-5" align="center" justify="space-between">
        <Flex direction="column" gap="$space-1">
          <Text variant="display2" color="$fg-base">{t('template.list.title')}</Text>
          <Text variant="body" color="$fg-base">{t('template.list.description')}</Text>
        </Flex>

        {/* <Button variant="secondary" size="large" onClick={navigateToCreateTemplate}>
          <IconPlus />
          {t('template.buttons.add')}
        </Button> */}
      </Flex>

      <TemplateCardContainer>
        {isLoading && (
          <TemplateCardSkeleton count={3} />
        )}

        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} />
        ))}
      </TemplateCardContainer>
    </Flex>
  )
}

function Settings({ isLoading, webhookUrl }: { isLoading: boolean, webhookUrl: string }) {
  return (
    <Flex direction="column" gap="$space-4">
      <Field>
        <Label>{t('agents.details.settings.fields.webhook_url.label')}</Label>

        <Flex align="center" gap="$space-4">
          {isLoading ? (
            <Skeleton style={{ width: '100%', height: '44px' }} />
          ) : (
            <Input prefix="URL" value={webhookUrl} />
          )}

          <IconButton size="large" label={t('agents.details.settings.buttons.copy')} onClick={() => { navigator.clipboard.writeText(webhookUrl) }} disabled={isLoading}>
            <IconCopySimple />
          </IconButton>
        </Flex>

        <FieldDescription>
          {t('agents.details.settings.fields.webhook_url.description')}
        </FieldDescription>
      </Field>
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
                onClick={() => navigate(-1)}
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
              />
            </Flex>
          </TabPanel>

          <TabPanel>
            <Settings isLoading={isLoading} webhookUrl={webhookUrl} />
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
