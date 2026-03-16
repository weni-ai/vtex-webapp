import { Button, EmptyState, EmptyStateActions, Flex, Heading, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RecentActivityHeader } from './RecentActivityHeader';
import { RecentActivityList } from './RecentActivityList';
import { RecentActivitySkeleton } from './RecentActivitySkeleton';
import { useRecentActivity } from './useRecentActivity';

function SkippedOnboardingEmpty({ isActivationEnabled }: { isActivationEnabled: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <EmptyState size="medium">
      <Heading>{t('recent_activity.empty.skipped.title')}</Heading>
      <Text>{t('recent_activity.empty.skipped.description')}</Text>
      <EmptyStateActions>
        <Button
          variant="primary"
          disabled={!isActivationEnabled}
          onClick={() => navigate('/onboarding')}
        >
          {t('recent_activity.empty.skipped.button')}
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}

function NoConversationsEmpty() { 
  const { t } = useTranslation();

  return (
    <EmptyState size="medium"> 
      <Heading>{t('recent_activity.empty.no_data.title')}</Heading>
      <Text>{t('recent_activity.empty.no_data.description')}</Text>
    </EmptyState>
  );
}

export function RecentActivity() {
  const { state, conversations, isActivationEnabled } = useRecentActivity();

  return (
    <Flex direction="column" gap="$space-4">
      <RecentActivityHeader showViewDetails={state === 'data'} />

      {state === 'loading' && <RecentActivitySkeleton />}
      {state === 'onboarding_skipped' && <SkippedOnboardingEmpty isActivationEnabled={isActivationEnabled} />}
      {state === 'empty' && <NoConversationsEmpty />}
      {state === 'data' && <RecentActivityList conversations={conversations} />}
    </Flex>
  );
}
