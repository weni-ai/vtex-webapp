import { Button, Flex, Heading, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { useConversationUsage } from './useConversationUsage';
import {
  getUsageTier,
  getTierStyles,
  getUsagePercentage,
  getTimeSaved,
  TRIAL_CONVERSATIONS_LIMIT,
} from './tiers';

interface ConversationUsageBannerProps {
  onViewPlans: () => void;
}

export function ConversationUsageBanner({ onViewPlans }: ConversationUsageBannerProps) {
  const { t } = useTranslation();
  const { conversationsCount, isLoading, error } = useConversationUsage();

  if (isLoading || error || conversationsCount === null) {
    return null;
  }

  const tier = getUsageTier(conversationsCount);
  const styles = getTierStyles(tier);
  const percentage = getUsagePercentage(conversationsCount);
  const remaining = Math.max(TRIAL_CONVERSATIONS_LIMIT - conversationsCount, 0);

  const timeSaved = getTimeSaved(conversationsCount);

  const interpolationValues: Record<string, string | number> = {
    count: conversationsCount.toLocaleString(),
    remaining: remaining.toLocaleString(),
    limit: TRIAL_CONVERSATIONS_LIMIT.toLocaleString(),
    percentage: Math.round(percentage),
    timeSaved: t(`conversation_usage.time.${timeSaved.unit}`, { value: timeSaved.value }),
  };

  return (
    <Flex
      direction="column"
      gap="$space-3"
      style={{
        background: styles.background,
        border: `1px solid ${styles.border}`,
        borderRadius: 'var(--sl-radius-2)',
        padding: 'var(--sl-space-4)',
      }}
    >
      <Flex gap="$space-4" align="center">
        <Flex direction="column" gap="$space-2" style={{ flex: '1 0 0' }}>
          <Heading variant="display3">
            {t(`conversation_usage.${tier}.title`, interpolationValues)}
          </Heading>
          <Text variant="emphasis">
            {t(`conversation_usage.${tier}.description`, interpolationValues)}
          </Text>
        </Flex>

        <Button onClick={onViewPlans} variant="primary">
          {t('conversation_usage.view_plans')}
        </Button>
      </Flex>

      <Flex
        style={{
          width: '100%',
          height: '6px',
          borderRadius: 'var(--sl-radius-2)',
          background: styles.barTrack,
          overflow: 'hidden',
        }}
      >
        <Flex
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: 'var(--sl-radius-2)',
            background: styles.barFill,
            transition: 'width 0.3s ease',
          }}
        />
      </Flex>
    </Flex>
  );
}
