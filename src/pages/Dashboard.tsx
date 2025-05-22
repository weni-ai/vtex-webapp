import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Alert, Button, Flex, Heading, IconArrowUpRight, IconPlus, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, toast } from '@vtex/shoreline';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AgentsGalleryModal } from '../components/agent/modals/Gallery';
import { AgentBox, AgentBoxContainer, AgentBoxSkeleton } from '../components/AgentBox';
import { AgentMetrics } from '../components/AgentMetrics';
import { disableAgent, updateAgentsList } from '../services/agent.service';
import { agents, hasTheFirstLoadOfTheAgentsHappened, selectProject } from '../store/projectSlice';
import { selectUser } from "../store/userSlice";
import getEnv from '../utils/env';

export function Dashboard() {
  const hasTheFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);
  const agentsListOriginal = useSelector(agents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);
  const [agentsRemoving, setAgentsRemoving] = useState<string[]>([]);
  const [updateAgentsListTimeout, setUpdateAgentsListTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const isAgentGalleryModalAccessEnabled = useFeatureIsOn('agentGalleryModalAccess');

  const agentsList = useMemo(() => {
    return agentsListOriginal.filter((item) => {
      if (isAgentGalleryModalAccessEnabled) {
        return item.isAssigned;
      }

      return ['commerce', 'nexus'].includes(item.origin);
    });
  }, [agentsListOriginal, isAgentGalleryModalAccessEnabled]);

  function navigateToAgent() {
    const dash = new URL(`/projects/${project_uuid}`, getEnv("VITE_APP_DASH_URL"));

    const VTEXAppParams = new URLSearchParams();

    if (userData?.user) {
      VTEXAppParams.append('email', userData.user);
    }

    dash.searchParams.append('vtex_app', VTEXAppParams.toString());

    window.open(dash.toString(), '_blank');
  }

  function assignedCommerceAgents() {
    return agentsList
      .filter((item) => item.isAssigned)
      .filter((item) => item.origin === 'commerce')
  }

  useEffect(() => {
    updateAgentsList();
  }, []);

  useEffect(() => {
    const rejectedAgents = assignedCommerceAgents().filter((item) => item.templateSynchronizationStatus === 'rejected');

    rejectedAgents.forEach(({ uuid }) => {
      tryRemoveAgent(uuid);
    });
  }, [agentsList]);

  useEffect(() => {
    const pendingAgents = assignedCommerceAgents().filter((item) => item.templateSynchronizationStatus === 'pending');

    if (pendingAgents.length > 0) {
      updateAgentsListSoon();
    }
  }, [agentsList]);

  async function tryRemoveAgent(uuid: string) {
    if (agentsRemoving.includes(uuid)) {
      return;
    }

    setAgentsRemoving((prev) => [...prev, uuid]);

    toast.critical(t('template_synchronization.rejected'));

    await disableAgent(project_uuid, uuid, 'commerce');

    setAgentsRemoving((prev) => prev.filter((item) => item !== uuid));
  }

  function updateAgentsListSoon() {
    if (updateAgentsListTimeout) {
      clearTimeout(updateAgentsListTimeout);
    }

    setUpdateAgentsListTimeout(setTimeout(async () => {
      await updateAgentsList();
    }, 3000));
  }

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading >
            {t('title')}
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ margin: '0', maxWidth: '100vw' }}>
        <Flex direction='column' style={{ width: '100%' }}>
          <Alert
            variant="informational"
            style={{
              width: '100%',
            }}
          >
            <Flex
              align="center"
              justify="space-between"
              style={{
                width: '100%',
              }}
            >
              <Text variant="emphasis" color="$fg-base">
                {t('improve.description')}
              </Text>

              <Button variant="tertiary" style={{ flex: 'none', }} onClick={navigateToAgent}>
                <Text variant='action'> {t('improve.button')}</Text>
                <IconArrowUpRight
                  height="1rem"
                  width="1rem"
                  display="inline"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginLeft: 'var(--sl-space-05)'
                  }}
                />
              </Button>
            </Flex>
          </Alert>

          <AgentMetrics />

          <Flex gap="$space-4" align="center" justify="space-between">
            <Heading
              variant="display2"
            >
              {t('agents.title')}
            </Heading>

            {isAgentGalleryModalAccessEnabled && (
              <Button variant="secondary" size="large" onClick={() => setIsGalleryModalOpen(true)}>
                <IconPlus />
                {t('agents.buttons.gallery')}
              </Button>
            )}
          </Flex>

          <AgentBoxContainer>
            {!hasTheFirstLoadHappened && (
              <AgentBoxSkeleton count={2} />
            )}

            {hasTheFirstLoadHappened && (
              agentsList.map((item) => (
                <AgentBox
                  key={item.uuid}
                  name={item.name || ''}
                  description={item.description || ''}
                  uuid={item.uuid}
                  code={item.code as 'order_status' | 'abandoned_cart'}
                  type={item.notificationType}
                  isIntegrated={item.isAssigned}
                  origin={item.origin || 'commerce'}
                  isInTest={item.isInTest}
                  isConfiguring={item.isConfiguring || false}
                  skills={item.skills || []}
                  onAssign={() => { }}
                />
              ))
            )}
          </AgentBoxContainer>
        </Flex>

        <AgentsGalleryModal open={isGalleryModalOpen} onClose={() => setIsGalleryModalOpen(false)} />
      </PageContent>
    </Page>
  )
}
