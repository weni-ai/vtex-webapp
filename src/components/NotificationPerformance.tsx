import { ContextualHelp, Flex, Skeleton, Text } from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessagesAnalytics } from '../api/insights/adapters';
import { getMessagesAnalytics } from '../services/insights.service';
import { getLast3MonthsDates } from '../utils';
import { formatNumber } from '../utils/formatters';

const MAX_BAR_HEIGHT = 137;

interface MetricConfig {
  key: keyof MessagesAnalytics;
  labelKey: string;
  color: string;
  tooltipKey?: string;
  borderRadius: string;
}

const METRICS_CONFIG: MetricConfig[] = [
  {
    key: 'sent',
    labelKey: 'notification_performance.sent',
    color: 'var(--sl-color-blue-2)',
    borderRadius: 'var(--sl-radius-1) var(--sl-radius-1) 0 var(--sl-radius-1)',
  },
  {
    key: 'delivered',
    labelKey: 'notification_performance.delivered',
    color: 'var(--sl-color-blue-4)',
    borderRadius: '0 var(--sl-radius-1) 0 0',
  },
  {
    key: 'read',
    labelKey: 'notification_performance.read',
    color: 'var(--sl-color-blue-6)',
    tooltipKey: 'notification_performance.read_tooltip',
    borderRadius: '0 var(--sl-radius-1) 0 0',
  },
  {
    key: 'clicked',
    labelKey: 'notification_performance.clicked',
    color: 'var(--sl-color-blue-8)',
    borderRadius: '0 var(--sl-radius-1) var(--sl-radius-1) 0',
  },
];

function computeBarHeight(value: number, maxValue: number): number {
  if (maxValue === 0) return 0;
  return Math.round((value / maxValue) * MAX_BAR_HEIGHT);
}

interface NotificationMetricColumnProps {
  label: string;
  value: string;
  barHeight: number;
  barColor: string;
  barBorderRadius: string;
  tooltipText?: string;
  tooltipLabel?: string;
  showLeftBorder: boolean;
}

function NotificationMetricColumn({
  label,
  value,
  barHeight,
  barColor,
  barBorderRadius,
  tooltipText,
  tooltipLabel,
  showLeftBorder,
}: NotificationMetricColumnProps) {
  return (
    <Flex
      direction="column"
      style={{
        flex: '1 0 0',
        minWidth: 0,
        minHeight: 0,
      }}
      gap="$space-0"
    >
      <Flex
        direction="column"
        style={{
          flex: '1 0 0',
          padding: '0 var(--sl-space-3)',
          gap: 'var(--sl-space-1)',
          paddingBottom: 'var(--sl-space-4)',
          borderLeft: showLeftBorder
            ? '1px solid var(--sl-color-blue-1)'
            : undefined,
        }}
      >
        <Flex align="center" style={{ gap: 'var(--sl-space-2)' }}>
          <Text
            variant="body"
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--sl-color-gray-9)',
            }}
          >
            {label}
          </Text>

          {tooltipText && tooltipLabel && (
            <ContextualHelp placement="bottom-start" label={tooltipLabel}>
              {tooltipText}
            </ContextualHelp>
          )}
        </Flex>

        <Text variant="display3" color="$fg-base">
          {value}
        </Text>
      </Flex>

      <Flex
        style={{
          width: '100%',
          height: `${barHeight}px`,
          backgroundColor: barColor,
          borderRadius: barBorderRadius,
        }}
      />
    </Flex>
  );
}

export function NotificationPerformance() {
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MessagesAnalytics | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const { startDate, endDate } = getLast3MonthsDates();
        const result = await getMessagesAnalytics(startDate, endDate);
        setData(result);
      } catch {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <Skeleton width="100%" height="256px" />;
  }

  const maxValue = data?.sent ?? 0;

  return (
    <Flex
      direction="column"
      gap="$space-6"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-2)',
        padding: 'var(--sl-space-6)',
      }}
    >
      <Text variant="display3" color="$fg-base">
        {t('notification_performance.title')}
      </Text>

      <Flex
        align="stretch"
        style={{ flex: '1 0 0' }}
        gap="$space-0"
      >
        {METRICS_CONFIG.map((metric, index) => {
          const rawValue = data?.[metric.key] ?? 0;
          const formattedValue = data
            ? formatNumber(rawValue, i18n.language)
            : '-';

          return (
            <NotificationMetricColumn
              key={metric.key}
              label={t(metric.labelKey)}
              value={formattedValue}
              barHeight={computeBarHeight(rawValue, maxValue)}
              barColor={metric.color}
              barBorderRadius={metric.borderRadius}
              tooltipText={
                metric.tooltipKey ? t(metric.tooltipKey) : undefined
              }
              tooltipLabel={
                metric.tooltipKey ? t(metric.labelKey) : undefined
              }
              showLeftBorder={index > 0}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}
