/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Alert, Button, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from '@vtex/shoreline';
import { DashboardItem } from '../components/DashboardItem';
import { FeatureBox } from '../components/FeatureBox';
import { useSelector } from 'react-redux';
import { agents, integratedAgents, selectProject } from '../store/projectSlice';
import { selectUser } from "../store/userSlice";
import { getSkillMetrics } from '../services/agent.service';

export function Dashboard() {
  const [data, setData] = useState<{ title: string; value: string; variation: number }[][]>([]);
  const agentsList = useSelector(agents)
  const integrated = useSelector(integratedAgents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSkillMetrics();
      if ('data' in response) {
        setData(response.data);
      }
    };
    fetchData();
  }, []);

  function navigateToAgent() {
    const dash = new URL(`https://dash.stg.cloud.weni.ai/projects/${project_uuid}`);

    const VTEXAppParams = new URLSearchParams();

    if (userData?.user) {
      VTEXAppParams.append('email', userData.user);
    }

    dash.searchParams.append('vtex_app', VTEXAppParams.toString());

    window.open(dash.toString(), '_blank');
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
                    title={detail.title}
                    value={detail.value}
                    percentageDifference={detail.variation}
                    style={{
                      borderRight: indexOfDetail !== line.length - 1 ? 'var(--sl-border-base)' : undefined,
                    }}
                  />
                ))}
              </Grid>
            ))}
          </Flex>

          <Flex
            direction="column"
            gap="$space-0"
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
                    title={detail.title}
                    value={detail.value}
                    percentageDifference={detail.variation}
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

          <Grid
            columns="repeat(auto-fill, minmax(21.5rem, 1fr))"
          >
            {agentsList.map((item: any) => (
              <FeatureBox
                key={item.uuid}
                uuid={item.uuid}
                code={item.code}
                type="active"
                isIntegrated={false}
                isInTest={item.isInTest}
              />
            ))}
            {integrated.map((item: any) => (
              <FeatureBox
                key={item.uuid}
                uuid={item.uuid}
                code={item.code}
                type="active"
                isIntegrated={true}
                isInTest={item.isInTest}
              />
            ))}
          </Grid>
        </Flex>
      </PageContent>
    </Page>
  )
}
