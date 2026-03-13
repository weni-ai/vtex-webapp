import {
  Alert,
  Button,
  Flex,
  Grid,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabProvider,
  Text,
  useTabStore,
} from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectOnboardingStatus } from '../store/onboardSlice';
import { isWhatsAppIntegrated, isWebChatIntegrated } from '../store/userSlice';
import { AITeamPerformance } from '../components/AITeamPerformance';
import { NotificationPerformance } from '../components/NotificationPerformance';
import { AbandonedCartRecovery } from '../components/AbandonedCartRecovery';
import { RecentActivity } from '../components/RecentActivity/RecentActivity';
import { SkippedOnboardingBanner } from '../components/SkippedOnboardingBanner';
import { ConversationUsageBanner } from '../components/ConversationUsageBanner';
import { selectProject, selectProjectDetail } from '../store/projectSlice';
import { refreshChannelIntegrations } from '../services/channel.service';
import { loadProjectDetail } from '../services/project.service';

function WebchatDashboardContent({ showTitle }: { showTitle: boolean }) {
  return <AITeamPerformance showTitle={showTitle} />;
}

function WhatsAppDashboardContent() {
  return (
    <Grid columns="3fr 2fr" gap="$space-5" style={{ minHeight: '302px' }}>
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

function DashboardLoading() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ height: '100%' }}
    >
      <Spinner size={32} description="loading" style={{ color: 'var(--sl-color-blue-10)' }} />
    </Flex>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const projectUuid = useSelector(selectProject);
  const projectDetail = useSelector(selectProjectDetail);
  const hasWhatsApp = useSelector(isWhatsAppIntegrated);
  const hasWebchat = useSelector(isWebChatIntegrated);
  const onboardingStatus = useSelector(selectOnboardingStatus);

  const [showOnboardingAlert] = useState(
    () => !!(location.state as Record<string, unknown> | null)?.fromOnboarding,
  );

  useEffect(() => {
    if ((location.state as Record<string, unknown> | null)?.fromOnboarding) {
      navigate('/dash', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [isDashboardReady, setIsDashboardReady] = useState(
    () => projectDetail !== null,
  );

  useEffect(() => {
    if (!projectUuid) return;

    Promise.all([
      refreshChannelIntegrations(projectUuid),
      loadProjectDetail(),
    ]).finally(() => {
      setIsDashboardReady(true);
    });
  }, [projectUuid]);

  const hasBothChannels = hasWebchat && hasWhatsApp;
  const isOnboardingSkipped =
    onboardingStatus?.skipped === true &&
    onboardingStatus?.completed !== true;

  const isTrialPlan = projectDetail?.organization_billing?.plan === 'trial';
  const displayConversationUsageBanner = !isOnboardingSkipped && isTrialPlan;

  const handleViewOnStore = () => {
    // TODO: implement "View on store" navigation
  };

  const handleViewPlans = () => {
    // TODO: implement "View Plans" navigation
  };

  return (
    <Page style={{ height: '100vh' }}>
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

      <PageContent style={{ height: '100%', marginBottom: '0' }}>
        {isDashboardReady ? (
          <Flex direction="column" gap="$space-5">
            {showOnboardingAlert && (
              <Alert variant="success">
                <Text variant="body">{t('dashboard.onboarding_complete_alert')}</Text>
              </Alert>
            )}

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
        ) : (
          <DashboardLoading />
        )}
      </PageContent>
    </Page>
  );
}
