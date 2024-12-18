import { useEffect, useState } from 'react';
import { Alert, Button, Divider, Filter, FilterItem, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Select, SelectItem, Text } from '@vtex/shoreline';
import WeniLogo from '../assets/weni-logo.svg';
import { DashboardItem } from '../components/DashboardItem';
import { FeatureBox } from '../components/FeatureBox';
import { VTEXFetch } from '../utils/VTEXFetch';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [period, setPeriod] = useState('Last 7 days');
  const [data, setData] = useState<{title: string; value: string; variation: number}[][]>([]);
  const navigate = useNavigate();

  function navigateToAgent(){
    navigate('/agent-builder')
  }

  useEffect(() => {
    VTEXFetch<{ data: { title: string; value: string; variation: number }[] }>('/agents/:uuid')
      .then(({ data }) => {
        const groupOfDetails: { title: string; value: string; variation: number }[][] = [[]];
        const maxPerGroup = 3;
  
        for (let i = 0; i < data.length; i++) {
          if (groupOfDetails.at(-1)?.length === maxPerGroup) {
            groupOfDetails.push([]);
          }
          groupOfDetails.at(-1)?.push(data[i]);
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
            Weni Agentic IA
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
              Unlock the full potential of your intelligent agent by connecting to the Weni platform. Access advanced features and customizable options to enhance performance and provide a better customer experience.
            </Text>

            <Button variant="primary" style={{ flex: 'none', }} onClick={navigateToAgent}>
              Improve your agent

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
        </Heading>
        
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
              columns="1fr 1fr 1fr"
              gap="$space-0"
              style={{
                borderBottom: indexOfLine !== data.length - 1 ? 'var(--sl-border-base)' : undefined,
              }}
            >
              {line.map((detail, indexOfDetail) => (
                <DashboardItem
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
          Integrate commerce skills
        </Heading>

        <Grid
          columns="repeat(auto-fill, minmax(15rem, 1fr))"
        >
          <FeatureBox
            title="Abandoned cart"
            type="active"
            description="Recover sales by reminding customers of items forgotten in the cart."
            isIntegrated={true}
          />

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
          />
        </Grid>
      </PageContent>
    </Page>
  )
}
