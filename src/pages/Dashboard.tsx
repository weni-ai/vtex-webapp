import { useEffect, useState } from 'react';
import { Alert, Button, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from '@vtex/shoreline';
import { DashboardItem } from '../components/DashboardItem';
import { FeatureBox } from '../components/FeatureBox';
import { VTEXFetch } from '../utils/VTEXFetch';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [data, setData] = useState<{ title: string; value: string; variation: number }[][]>([]);
  const navigate = useNavigate();

  function navigateToAgent() {
    // window.open('https://dash.weni.ai/', '_blank');
    navigate('/channels')
  }

  useEffect(() => {
    VTEXFetch<{ data: { title: string; value: string; variation: number }[] }>('/agents/:uuid')
      .then(({ data }) => {
        const groupOfDetails: { title: string; value: string; variation: number }[][] = [[]];
        const maxPerGroup = 3;

        for (const item of data) {
          if (groupOfDetails[groupOfDetails.length - 1]?.length === maxPerGroup) {
            groupOfDetails.push([]);
          }

          groupOfDetails[groupOfDetails.length - 1]?.push(item);
        }

        setData(groupOfDetails);
      })
      .catch((error) => {
        console.error('VTEXFetch failed:', error);
      });
  }, []);

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading >
            Weni Agentic IA
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ margin: '0', maxWidth: '100vw'}}>
        <Flex direction='column' style={{width:'100%'}}>
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
                Connect agents to the Weni platform to access advanced features and customizable options.
              </Text>

              <Button variant="tertiary" style={{ flex: 'none', }} onClick={navigateToAgent}>
                <Text variant='action'> Connect to Weni</Text>
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

          <Heading
            variant="display2"
          >
            {t('agent_gallery.title')}
          </Heading>

          <Grid
            columns="repeat(auto-fill, minmax(15rem, 1fr))"
          >
            <FeatureBox
              title={t('agent_gallery.features.abandoned_cart.title')}
              type="active"
              description={t('agent_gallery.features.abandoned_cart.description')}
              isIntegrated={false}
            />
          </Grid>
        </Flex>
      </PageContent>
    </Page>
  )
}
