import { Alert, Button, Flex, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, toast } from '@vtex/shoreline';
import { AgentBox, AgentBoxSkeleton, AgentBoxContainer } from '../components/AgentBox';
import { useSelector } from 'react-redux';
import { agents, integratedAgents, selectProject, hasTheFirstLoadOfTheAgentsHappened } from '../store/projectSlice';
import { selectUser } from "../store/userSlice";
import { useEffect, useState } from 'react';
import { disableAgent, updateAgentsList } from '../services/agent.service';

export function Dashboard() {
  const hasTheFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);
  const agentsList = useSelector(agents)
  const integrated = useSelector(integratedAgents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);
  const [agentsRemoving, setAgentsRemoving] = useState<string[]>([]);
  const [updateAgentsListTimeout, setUpdateAgentsListTimeout] = useState<NodeJS.Timeout | null>(null);

  function navigateToAgent() {
    const dash = new URL(`https://dash.stg.cloud.weni.ai/projects/${project_uuid}`);

    const VTEXAppParams = new URLSearchParams();

    if (userData?.user) {
      VTEXAppParams.append('email', userData.user);
    }

    dash.searchParams.append('vtex_app', VTEXAppParams.toString());

    window.open(dash.toString(), '_blank');
  }

  useEffect(() => {
    updateAgentsList();
  }, []);

  useEffect(() => {
    const rejectedAgents = integrated.filter((item) => item.templateSynchronizationStatus === 'rejected');

    rejectedAgents.forEach(({ uuid }) => {
      tryRemoveAgent(uuid);
    });
  }, [integrated]);

  useEffect(() => {
    const pendingAgents = integrated.filter((item) => item.templateSynchronizationStatus === 'pending');

    if (pendingAgents.length > 0) {
      updateAgentsListSoon();
    }
  }, [integrated]);

  async function tryRemoveAgent(uuid: string) {
    if (agentsRemoving.includes(uuid)) {
      return;
    }

    setAgentsRemoving((prev) => [...prev, uuid]);

    toast.critical(t('agents.common.errors.template_synchronization.rejected'));

    await disableAgent(project_uuid, uuid);

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

          <Heading
            variant="display2"
          >
            {t('agents.title')}
          </Heading>

          <AgentBoxContainer>
            {!hasTheFirstLoadHappened && (
              <AgentBoxSkeleton count={2} />
            )}

            {hasTheFirstLoadHappened && (
              <>
                {agentsList.map((item) => (
                  <AgentBox
                    key={item.uuid}
                    uuid={item.uuid}
                    code={item.code}
                    type="active"
                    isIntegrated={false}
                    isInTest={item.isInTest}
                    isConfiguring={item.isConfiguring}
                  />
                ))}
                {integrated.map((item) => (
                  <AgentBox
                    key={item.uuid}
                    uuid={item.uuid}
                    code={item.code}
                    type="active"
                    isIntegrated={true}
                    isInTest={item.isInTest}
                    isConfiguring={item.isConfiguring}
                  />
                ))}
              </>
            )}
          </AgentBoxContainer>
        </Flex>
      </PageContent>
    </Page>
  )
}
