import { Alert, Button, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from '@vtex/shoreline';
import { FeatureBox } from '../components/FeatureBox';
import { useSelector } from 'react-redux';
import { agents, integratedAgents, selectProject } from '../store/projectSlice';
import { selectUser } from "../store/userSlice";
import { useEffect } from 'react';
import { updateAgentsList } from '../services/agent.service';

export function Dashboard() {
  const agentsList = useSelector(agents)
  const integrated = useSelector(integratedAgents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);

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

          <Grid
            columns="repeat(auto-fill, minmax(21.5rem, 1fr))"
          >
            {agentsList.map((item) => (
              <FeatureBox
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
              <FeatureBox
                key={item.uuid}
                uuid={item.uuid}
                code={item.code}
                type="active"
                isIntegrated={true}
                isInTest={item.isInTest}
                isConfiguring={item.isConfiguring}
              />
            ))}
          </Grid>
        </Flex>
      </PageContent>
    </Page>
  )
}
