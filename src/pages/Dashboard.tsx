import {
  Alert,
  Button,
  Filter,
  FilterItem,
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
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SkillMetricsData } from '../api/agents/adapters';
import { selectOnboardingStatus } from '../store/onboardSlice';
import { isWhatsAppIntegrated } from '../store/userSlice';
import { AITeamPerformance } from '../components/AITeamPerformance';
import { NotificationPerformance } from '../components/NotificationPerformance';
import { AbandonedCartRecovery } from '../components/AbandonedCartRecovery';
import { Audit } from '../components/audit/Audit';
import { SkippedOnboardingBanner } from '../components/SkippedOnboardingBanner';
import { ConversationUsageBanner } from '../components/ConversationUsageBanner';
import { selectProject, selectProjectDetail } from '../store/projectSlice';
import { refreshChannelIntegrations } from '../services/channel.service';
import { loadProjectDetail } from '../services/project.service';
import { useSkillMetrics } from '../components/WhatsAppDashboard/useSkillMetrics';
import { useDashboardDateRange } from '../hooks/useDashboardDateRange';
import type { DateRange, DashboardPeriod } from '../utils';

const PERIOD_FILTER_OPTIONS: { value: DashboardPeriod; labelKey: string }[] = [
  { value: 'today', labelKey: 'metrics.fields.period.options.today' },
  { value: 'yesterday', labelKey: 'metrics.fields.period.options.yesterday' },
  { value: 'last_7_days', labelKey: 'metrics.fields.period.options.last_7_days' },
  { value: 'last_30_days', labelKey: 'metrics.fields.period.options.last_30_days' },
  { value: 'this_month', labelKey: 'metrics.fields.period.options.this_month' },
];

interface PeriodFilterProps {
  isFilterVisible: boolean;
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
}

interface PerformanceSectionHeaderProps extends PeriodFilterProps {
  title: string;
}

function PerformanceSectionHeader({
  title,
  isFilterVisible,
  period,
  onPeriodChange,
}: PerformanceSectionHeaderProps) {
  const { t } = useTranslation();

  const periodLabel = useMemo(() => {
    const match = PERIOD_FILTER_OPTIONS.find((option) => option.value === period);
    return match ? t(match.labelKey) : '';
  }, [period, t]);

  const handlePeriodChange = useMemo(() => {
    return ((value: React.SetStateAction<string>) => {
      const resolvedLabel = typeof value === 'function' ? value(periodLabel) : value;
      const match = PERIOD_FILTER_OPTIONS.find(
        (option) => t(option.labelKey) === resolvedLabel,
      );
      if (match) {
        onPeriodChange(match.value);
      }
    }) as React.Dispatch<React.SetStateAction<string>>;
  }, [periodLabel, onPeriodChange, t]);

  return (
    <Flex justify="space-between" align="center">
      <Text variant="display2">{title}</Text>

      {isFilterVisible && (
        <Filter
          label={t('metrics.fields.period.label')}
          value={periodLabel}
          setValue={handlePeriodChange}
        >
          {PERIOD_FILTER_OPTIONS.map((option) => (
            <FilterItem key={option.value} value={t(option.labelKey)}>
              {t(option.labelKey)}
            </FilterItem>
          ))}
        </Filter>
      )}
    </Flex>
  );
}

interface WebchatDashboardContentProps extends PeriodFilterProps {
  dateRange: DateRange;
}

function WebchatDashboardContent({
  dateRange,
  isFilterVisible,
  period,
  onPeriodChange,
}: WebchatDashboardContentProps) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-4">
      <PerformanceSectionHeader
        title={t('ai_team_performance.title')}
        isFilterVisible={isFilterVisible}
        period={period}
        onPeriodChange={onPeriodChange}
      />
      <AITeamPerformance dateRange={dateRange} />
    </Flex>
  );
}

interface WhatsAppDashboardContentProps {
  skillMetricsData: SkillMetricsData;
  dateRange: DateRange;
  isSkillMetricsLoading: boolean;
}

function WhatsAppDashboardContent({
  skillMetricsData,
  dateRange,
  isSkillMetricsLoading,
}: WhatsAppDashboardContentProps) {
  return (
    <Grid columns="3fr 2fr" gap="$space-5" style={{ minHeight: '302px' }}>
      <NotificationPerformance data={skillMetricsData} isLoading={isSkillMetricsLoading} />
      <AbandonedCartRecovery
        skillMetricsData={skillMetricsData}
        dateRange={dateRange}
        isSkillMetricsLoading={isSkillMetricsLoading}
      />
    </Grid>
  );
}

interface DashboardTabbedContentProps extends PeriodFilterProps {
  skillMetricsData: SkillMetricsData;
  dateRange: DateRange;
  isSkillMetricsLoading: boolean;
}

function DashboardTabbedContent({
  skillMetricsData,
  dateRange,
  isSkillMetricsLoading,
  isFilterVisible,
  period,
  onPeriodChange,
}: DashboardTabbedContentProps) {
  const { t } = useTranslation();
  const tabStore = useTabStore();

  return (
    <Flex direction="column" gap="$space-4">
      <PerformanceSectionHeader
        title={t('dashboard.performance')}
        isFilterVisible={isFilterVisible}
        period={period}
        onPeriodChange={onPeriodChange}
      />

      <TabProvider store={tabStore}>
        <Flex direction="column" gap="$space-3">
          <TabList>
            <Tab id="abandoned-cart-recovery">
              {t('dashboard.tabs.abandoned_cart_recovery')}
            </Tab>
            <Tab id="agent-performance">
              {t('dashboard.tabs.agent_performance')}
            </Tab>
          </TabList>

          <TabPanel tabId="abandoned-cart-recovery" style={{ padding: '0' }}>
            <WhatsAppDashboardContent
              skillMetricsData={skillMetricsData}
              dateRange={dateRange}
              isSkillMetricsLoading={isSkillMetricsLoading}
              />
          </TabPanel>

          <TabPanel tabId="agent-performance" style={{ padding: '0' }}>
            <AITeamPerformance dateRange={dateRange} />
          </TabPanel>
        </Flex>
      </TabProvider>
    </Flex>
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
  const isTrialPlan = !projectDetail || projectDetail.organization_billing?.plan === 'trial';
  const {
    dateRange,
    period,
    setPeriod,
    isFilterVisible,
  } = useDashboardDateRange(isTrialPlan);
  const skillMetrics = useSkillMetrics(dateRange);

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
  const isDashboardReady = isProjectReady && (!hasWhatsApp || !skillMetrics.isInitialLoading);
  const isOnboardingSkipped =
    onboardingStatus?.skipped === true &&
    onboardingStatus?.completed !== true;

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
              <DashboardTabbedContent
                skillMetricsData={skillMetrics.data}
                dateRange={dateRange}
                isSkillMetricsLoading={skillMetrics.isLoading}
                isFilterVisible={isFilterVisible}
                period={period}
                onPeriodChange={setPeriod}
              />
            ) : (
              <WebchatDashboardContent
                dateRange={dateRange}
                isFilterVisible={isFilterVisible}
                period={period}
                onPeriodChange={setPeriod}
              />
            )}

            {displayConversationUsageBanner && (
              <ConversationUsageBanner onViewPlans={handleViewPlans} />
            )}

            <Audit />
          </Flex>
        ) : (
          <DashboardLoading />
        )}
      </PageContent>
    </Page>
  );
}
