import { Alert, Button, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, toast } from '@vtex/shoreline';
import { AgentBox, AgentBoxSkeleton, AgentBoxContainer } from '../components/AgentBox';
import { useSelector } from 'react-redux';
import { agents, integratedAgents, selectProject, hasTheFirstLoadOfTheAgentsHappened } from '../store/projectSlice';
import { selectUser } from "../store/userSlice";
import { useEffect, useState } from 'react';
import { disableAgent, getSkillMetrics, updateAgentsList } from '../services/agent.service';
import { DashboardItem } from '../components/DashboardItem';
import getEnv from '../utils/env';

export function Dashboard() {
  const hasTheFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);
  const agentsList = useSelector(agents)
  const integrated = useSelector(integratedAgents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);
  const [agentsRemoving, setAgentsRemoving] = useState<string[]>([]);
  const [updateAgentsListTimeout, setUpdateAgentsListTimeout] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<{ title: string; value: string; }[][]>([]);

  function navigateToAgent() {
    const dash = new URL(`/projects/${project_uuid}`, getEnv("VITE_APP_DASH_URL"));

    const VTEXAppParams = new URLSearchParams();

    if (userData?.user) {
      VTEXAppParams.append('email', userData.user);
    }

    dash.searchParams.append('vtex_app', VTEXAppParams.toString());

    window.open(dash.toString(), '_blank');
  }

  useEffect(() => {
    const fetchData = async () => {
      setData([]);
      
      const response = await getSkillMetrics();

      if ('data' in response) {
        let data = [];

        for (let i = 0; i < response.data.length; i += 3) {
          data.push(response.data.slice(i, i + 3));
        }
        
        setData(data);
      }
    };
    fetchData();
  }, []);

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

  function getDashboardTitleById(id: string) {
    const knownIds = ['sent-messages', 'delivered-messages', 'read-messages', 'interactions', 'utm-revenue', 'orders-placed'];

    if (knownIds.includes(id)) {
      return t(`insights.dashboard.abandoned_cart.${id.replace(/-/g, '_')}`);
    }

    return id;
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

          <Flex
            direction="column"
            gap="$space-0"
            style={{
              border: 'var(--sl-border-base)',
              borderRadius: 'var(--sl-radius-2)',
              display: data.length > 0 ? 'block' : 'none',
            }}
          >
            {data.map((line, indexOfLine) => (
              <Grid
                key={`line-${indexOfLine}`}
                columns="1fr 1fr 1fr"
                gap="$space-0"
                style={{
                  borderBottom: indexOfLine !== data.length - 1 ? 'var(--sl-border-base)' : undefined,
                }}
              >
                {line.map((detail, indexOfDetail) => (
                  <DashboardItem
                    key={`detail-${detail.value}`}
                    title={getDashboardTitleById(detail.title)}
                    value={detail.value}
                    style={{
                      borderRight: indexOfDetail !== line.length - 1 ? 'var(--sl-border-base)' : undefined,
                    }}
                  />
                ))}
              </Grid>
            ))}
          </Flex>

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
