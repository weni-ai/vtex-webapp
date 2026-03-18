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
import type { SkillMetricsData } from '../api/agents/adapters';
import { selectOnboardingStatus } from '../store/onboardSlice';
import { isWhatsAppIntegrated } from '../store/userSlice';
import { AITeamPerformance } from '../components/AITeamPerformance';
import { NotificationPerformance } from '../components/NotificationPerformance';
import { AbandonedCartRecovery } from '../components/AbandonedCartRecovery';
import { RecentActivity } from '../components/RecentActivity/RecentActivity';
import { SkippedOnboardingBanner } from '../components/SkippedOnboardingBanner';
import { ConversationUsageBanner } from '../components/ConversationUsageBanner';
import { selectProject, selectProjectDetail } from '../store/projectSlice';
import { refreshChannelIntegrations } from '../services/channel.service';
import { loadProjectDetail } from '../services/project.service';
import { useSkillMetrics } from '../components/WhatsAppDashboard/useSkillMetrics';

function PerformanceSectionHeader({ title }: { title: string }) {
  return (
    <Flex justify="space-between" align="center">
      <Text variant="display2">{title}</Text>

      {/* TODO: Add filters in the near future */}
    </Flex>
  );
}

function WebchatDashboardContent() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-4">
      <PerformanceSectionHeader title={t('ai_team_performance.title')} />
      <AITeamPerformance />
    </Flex>
  );
}

function WhatsAppDashboardContent({ skillMetricsData }: { skillMetricsData: SkillMetricsData }) {
  return (
    <Grid columns="3fr 2fr" gap="$space-5" style={{ minHeight: '302px' }}>
      <NotificationPerformance data={skillMetricsData} />
      <AbandonedCartRecovery skillMetricsData={skillMetricsData} />
    </Grid>
  );
}

function DashboardTabbedContent({ skillMetricsData }: { skillMetricsData: SkillMetricsData }) {
  const { t } = useTranslation();
  const tabStore = useTabStore();

  return (
    <TabProvider store={tabStore}>
      <TabList>
        <Tab id="abandoned-cart-recovery">
          {t('dashboard.tabs.abandoned_cart_recovery')}
        </Tab>
        <Tab id="agent-performance">
          {t('dashboard.tabs.agent_performance')}
        </Tab>
      </TabList>

      <TabPanel tabId="abandoned-cart-recovery" style={{ padding: '0' }}>
        <Flex direction="column" gap="$space-4">
          <PerformanceSectionHeader title={t('dashboard.performance')} />
          <WhatsAppDashboardContent skillMetricsData={skillMetricsData} />
        </Flex>
      </TabPanel>

      <TabPanel tabId="agent-performance" style={{ padding: '0' }}>
        <Flex direction="column" gap="$space-4">
          <PerformanceSectionHeader title={t('dashboard.performance')} />
          <AITeamPerformance />
        </Flex>
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
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const skillMetrics = useSkillMetrics();

  const [showOnboardingAlert] = useState(
    () => !!(location.state as Record<string, unknown> | null)?.fromOnboarding,
  );

  useEffect(() => {
    if ((location.state as Record<string, unknown> | null)?.fromOnboarding) {
      navigate('/dash', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [isProjectReady, setIsProjectReady] = useState(
    () => projectDetail !== null,
  );

  useEffect(() => {
    if (!projectUuid) return;

    Promise.all([
      refreshChannelIntegrations(projectUuid),
      loadProjectDetail(),
    ]).finally(() => {
      setIsProjectReady(true);
    });
  }, [projectUuid]);

  const showWhatsAppContent = hasWhatsApp && skillMetrics.hasValidData;
  const isDashboardReady = isProjectReady && (!hasWhatsApp || !skillMetrics.isLoading);
  const isOnboardingSkipped =
    onboardingStatus?.skipped === true &&
    onboardingStatus?.completed !== true;

  const isTrialPlan = projectDetail?.organization_billing?.plan === 'trial';
  const displayConversationUsageBanner = !isOnboardingSkipped && isTrialPlan;
  const vtexHostStore = projectDetail?.config.vtex_host_store;

  const handleViewOnStore = () => {
    window.open(vtexHostStore, '_blank');
  };

  const handleViewPlans = () => {
    navigate('/billing-plans');
  };

  return (
    <Page style={{ height: '100vh' }}>
      <PageHeader>
        <PageHeaderRow>
          <PageHeading>{t('dashboard.title')}</PageHeading>

          {!isOnboardingSkipped && (
            <Flex gap="$space-2">
              {vtexHostStore && (
                <Button variant="tertiary" onClick={handleViewOnStore}>
                  {t('dashboard.view_on_store')}
                </Button>
              )}
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

            {showWhatsAppContent && skillMetrics.data ? (
              <DashboardTabbedContent skillMetricsData={skillMetrics.data} />
            ) : (
              <WebchatDashboardContent />
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
