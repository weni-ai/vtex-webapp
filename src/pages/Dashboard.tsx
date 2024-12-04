import { useState } from 'react';
import { Alert, Button, Divider, Filter, FilterItem, Flex, Grid, Heading, IconArrowUpRight, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Select, SelectItem, Text } from '@vtex/shoreline';
import WeniLogo from '../assets/weni-logo.svg';
import { DashboardItem } from '../components/DashboardItem';
import { FeatureBox } from '../components/FeatureBox';

export function Dashboard() {
  const [period, setPeriod] = useState('Last 7 days')

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

            <Button variant="primary" style={{ flex: 'none', }}>
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
          <Grid
            columns="1fr 1fr 1fr"
            gap="$space-0"
            style={{
              borderBottom: 'var(--sl-border-base)',
            }}
          >
            <DashboardItem
              title="Sent messages"
              value="1325"
              percentageDifference={5.06}
              style={{
                borderRight: 'var(--sl-border-base)',
              }}
            />

            <DashboardItem
              title="Delivered messages"
              value="1259"
              percentageDifference={-1.12}
              style={{
                borderRight: 'var(--sl-border-base)',
              }}
            />

            <DashboardItem
              title="Readed messages"
              value="956"
              percentageDifference={-2.08}
            />
          </Grid>

          <Grid
            columns="1fr 1fr 1fr"
            gap="$space-0"
          >
            <DashboardItem
              title="Interactions"
              value="569"
              percentageDifference={6.13}
              style={{
                borderRight: 'var(--sl-border-base)',
              }}
            />
            
            <DashboardItem
              title="UTM revenue"
              value="R$ 44.566,00"
              percentageDifference={12.2}
              style={{
                borderRight: 'var(--sl-border-base)',
              }}
            />
            
            <DashboardItem
              title="Orders placed"
              value="86"
              percentageDifference={0}
            />
          </Grid>
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
