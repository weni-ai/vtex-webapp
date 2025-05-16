import { Bleed, Button, Flex, IconArrowLeft, IconButton, IconPlus, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Text, toast } from '@vtex/shoreline';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateCard, TemplateCardContainer } from '../../components/TemplateCard';
import { PublishModal } from '../../components/agent/modals/Publish';
import { SwitchToTestModeModal } from '../../components/agent/modals/SwitchToTestMode';

export interface Template {
  name: string;
  description: string;
  status: 'active' | 'rejected' | 'pending' | 'needs-editing';
}

function TemplateList({ navigateToCreateTemplate, templates }: { navigateToCreateTemplate: () => void, templates: Template[] }) {
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
        {templates.map((template, index) => (
          <TemplateCard key={index} {...template} />
        ))}
      </TemplateCardContainer>
    </Flex>
  )
}

export function AgentIndex() {
  const navigate = useNavigate();
  const { agentUuid } = useParams();

  const agentName = 'Order Status';
  const [agentStatus, setAgentStatus] = useState<'test' | 'production'>('test');

  const [isSwitchToTestModeModalOpen, setIsSwitchToTestModeModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const templates: Template[] = [
    {
      name: 'Payment Approved',
      description: 'Olá {{1}}, seu pagamento para o pedido #{{2}} foi aprovado! Em breve iniciaremos a separação do seu pedido.',
      status: 'active',
    },
    {
      name: 'Payment Cancelled',
      description: 'Olá {{1}}, seu pagamento para o pedido #{{2}} foi aprovado! Em breve iniciaremos a separação do seu pedido.',
      status: 'rejected',
    },
    {
      name: 'Order Shipped',
      description: 'Olá {{1}}, seu pagamento para o pedido #{{2}} foi aprovado! Em breve iniciaremos a separação do seu pedido.',
      status: 'pending',
    },
    {
      name: 'Order Invoiced',
      description: 'Olá {{1}}, seu pagamento para o pedido #{{2}} foi aprovado! Em breve iniciaremos a separação do seu pedido.',
      status: 'needs-editing',
    },
  ];

  function navigateToCreateTemplate() {
    navigate(`/agents/${agentUuid}/templates/create`);
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

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="secondary" size="large">
                {t('agent.buttons.preview')}
              </Button>
            </Bleed>

            {agentStatus === 'test' && (
              <Bleed top="$space-2" bottom="$space-2">
                <Button variant="primary" size="large" onClick={() => setIsPublishModalOpen(true)}>
                  {t('agent.buttons.publish')}
                </Button>
              </Bleed>
            )}

            {agentStatus === 'production' && (
              <Bleed top="$space-2" bottom="$space-2">
                <Button variant="critical" size="large" onClick={() => setIsSwitchToTestModeModalOpen(true)}>
                  {t('agent.buttons.switch_to_test')}
                </Button>
              </Bleed>
            )}
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <TemplateList navigateToCreateTemplate={navigateToCreateTemplate} templates={templates} />

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
