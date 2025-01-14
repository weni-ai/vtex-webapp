import { useEffect, useState } from 'react';
import { Alert, Button, Divider, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from '@vtex/shoreline';
import WeniLogo from '../assets/weni-logo.svg';
import { DashboardItem } from '../components/DashboardItem';
import { FeatureBox } from '../components/FeatureBox';
import { VTEXFetch } from '../utils/VTEXFetch';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  // const [period, setPeriod] = useState('Last 7 days');
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
        <PageHeaderRow style={{
          justifyContent: 'start',
          gap: 'var(--sl-space-3)'
        }}>
          <img src={WeniLogo} className="d-inline" />

          <PageHeading>
            {t('title')}
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <Divider />

      <PageContent>
        <Alert
          variant="informational"
          style={{
            marginTop: 'var(--sl-space-1)',
            marginBottom: 'var(--sl-space-6)',
          }}
        >
          <Flex
            align="center"
            justify="space-between"
            style={{
              width: '100%',
            }}
          >
            <Text variant="body" color="$fg-base">
             {t('improve.description')}
            </Text>

            <Button variant="primary" style={{ flex: 'none', }} onClick={navigateToAgent}>
              {t('improve.button')}

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


        {/* <Heading
          variant="display3"
          style={{
            marginBlock: 'var(--sl-space-6)'
          }}
        >
          See what's happening in:

          <Select>
            <SelectItem value="option 1">option 1</SelectItem>
            <SelectItem value="option 2">option 2</SelectItem>
            <SelectItem value="option 3">option 3</SelectItem>
            <SelectItem value="option 4">option 4</SelectItem>
            <SelectItem value="option 5">option 5</SelectItem>
          </Select>
                
          <Filter label="Period" value={period} setValue={setPeriod}>
            <FilterItem value="Last 7 days">Last 7 days</FilterItem>
          </Filter>
        </Heading> */}

        <Flex
          direction="column"
          gap="$space-0"
          style={{
            border: 'var(--sl-border-base)',
            borderRadius: 'var(--sl-radius-2)',
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
          variant="display3"
          style={{
            marginBlock: 'var(--sl-space-6)'
          }}
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
          {/* 
          <FeatureBox
            title="Order tracking"
            type="passive"
            description="Allow your customers to track the delivery of their purchases."
            isIntegrated={false}
          />

          <FeatureBox
            title="Order status"
            type="passive"
            description="Inform your customers about the progress of their orders in real time."
            isIntegrated={false}
          /> */}
        </Grid>
      </PageContent>
    </Page>
  )
}
