import {
  Bleed,
  Flex,
  IconArrowLeft,
  IconButton,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Tab,
  TabList,
  TabPanel,
  TabProvider,
  useTabStore,
} from '@vtex/shoreline';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateAgentsList } from '../services/agent.service';
import { CustomerServiceTab } from './settings/CustomerServiceTab';
import { WhatsAppTab } from './settings/WhatsAppTab';
import { isWhatsAppIntegrated } from '../store/userSlice';
import { useSelector } from 'react-redux';

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tabStore = useTabStore();

  const hasWhatsApp = useSelector(isWhatsAppIntegrated);

  useEffect(() => {
    updateAgentsList();
  }, []);

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading>
            <Flex align="center">
              <Bleed top="$space-2" bottom="$space-2">
                <IconButton
                  label={t('common.return')}
                  asChild
                  variant="tertiary"
                  size="large"
                  onClick={() => navigate('/dash')}
                  data-testid="back-button"
                >
                  <IconArrowLeft />
                </IconButton>
              </Bleed>
              {t('settings.title')}
            </Flex>
          </PageHeading>
        </PageHeaderRow>

        <TabProvider store={tabStore}>
          <TabList>
            <Tab id="customer-service">
              {t('settings.tabs.customer_service')}
            </Tab>
         
            {hasWhatsApp && (
              <Tab id="whatsapp">
                {t('settings.tabs.whatsapp')}
              </Tab>
            )}
          </TabList>
        </TabProvider>
      </PageHeader>

      <PageContent style={{ margin: '0', maxWidth: '100vw' }}>
        <TabProvider store={tabStore}>
          <TabPanel tabId="customer-service" style={{ padding: '0' }}>
            <CustomerServiceTab />
          </TabPanel>
         
          {hasWhatsApp && (
            <TabPanel tabId="whatsapp" style={{ padding: '0' }}>
              <WhatsAppTab />
            </TabPanel>
          )}
        </TabProvider>
      </PageContent>
    </Page>
  );
}
