import {
  Button,
  Flex,
  Grid,
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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectOnboardingStatus } from '../store/onboardSlice';
import { isWhatsAppIntegrated, isWebChatIntegrated } from '../store/userSlice';
import { AITeamPerformance } from '../components/AITeamPerformance';
import { NotificationPerformance } from '../components/NotificationPerformance';
import { AbandonedCartRecovery } from '../components/AbandonedCartRecovery';
import { RecentActivity } from '../components/RecentActivity/RecentActivity';
import { SkippedOnboardingBanner } from '../components/SkippedOnboardingBanner';
import { ConversationUsageBanner } from '../components/ConversationUsageBanner';

function WebchatDashboardContent({ showTitle }: { showTitle: boolean }) {
  return <AITeamPerformance showTitle={showTitle} />;
}

function WhatsAppDashboardContent() {
  return (
    <Grid columns="3fr 2fr" gap="$space-5">
      <NotificationPerformance />   
      <AbandonedCartRecovery />
    </Grid>
  );
}

function DashboardTabbedContent() {
  const { t } = useTranslation();
  const tabStore = useTabStore();

  return (
    <TabProvider store={tabStore}>
      <TabList>
        <Tab id="agent-performance">
          {t('dashboard.tabs.agent_performance')}
        </Tab>
        <Tab id="whatsapp-store">
          {t('dashboard.tabs.whatsapp_store')}
        </Tab>
      </TabList>

      <TabPanel tabId="agent-performance" style={{ padding: '0' }} >
        <WebchatDashboardContent showTitle={false} />
      </TabPanel>

      <TabPanel tabId="whatsapp-store" style={{ padding: '0' }}>
        <WhatsAppDashboardContent />
      </TabPanel>
    </TabProvider>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const hasWhatsApp = useSelector(isWhatsAppIntegrated);
  const hasWebchat = useSelector(isWebChatIntegrated);
  const onboardingStatus = useSelector(selectOnboardingStatus);

  const hasBothChannels = hasWebchat && hasWhatsApp;
  const isOnboardingSkipped =
    onboardingStatus?.skipped === true &&
    onboardingStatus?.completed !== true;

  const isTrialPlan = true;
  const displayConversationUsageBanner = !isOnboardingSkipped && isTrialPlan;

  const handleViewOnStore = () => {
    // TODO: implement "View on store" navigation
  };

  const handleViewPlans = () => {
    // TODO: implement "View Plans" navigation
  };

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading>{t('dashboard.title')}</PageHeading>

          {!isOnboardingSkipped && (
            <Flex gap="$space-2">
              <Button variant="tertiary" onClick={handleViewOnStore}>
                {t('dashboard.view_on_store')}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/settings')}>
                {t('dashboard.settings')}
              </Button>
            </Flex>
          )}
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <Flex direction="column" gap="$space-5">
          {isOnboardingSkipped && <SkippedOnboardingBanner />}

          {hasBothChannels ? (
            <DashboardTabbedContent />
          ) : hasWhatsApp ? (
            <WhatsAppDashboardContent />
          ) : (
            <WebchatDashboardContent showTitle={true} />
          )}

          {displayConversationUsageBanner && (
            <ConversationUsageBanner onViewPlans={handleViewPlans} />
          )}

          <RecentActivity />
        </Flex>
      </PageContent>
    </Page>
  );
}
