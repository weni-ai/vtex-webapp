import { Button, Flex, IconPlus, Page, PageContent, Text } from '@vtex/shoreline';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateCard, TemplateCardContainer } from '../../components/TemplateCard';

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

  return (
    <Page>
      <PageContent>
        <TemplateList navigateToCreateTemplate={navigateToCreateTemplate} templates={templates} />
      </PageContent>
    </Page>
  )
}
