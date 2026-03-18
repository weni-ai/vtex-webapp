import { Flex } from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConversationTotals, CSATData } from '../api/insights/adapters';
import {
  getConversationTotals,
  getCSAT,
} from '../services/insights.service';
import type { DateRange } from '../utils';
import { formatNumber } from '../utils/formatters';
import { MetricCard, type MetricCardProps } from './MetricCard';
import { MetricGrid } from './MetricGrid';

function buildMetrics(
  conversationTotals: ConversationTotals | null,
  csat: CSATData | null,
  t: (key: string, options?: Record<string, unknown>) => string,
  language: string,
): MetricCardProps[] {
  return [
    {
      label: t('ai_team_performance.total_engagements.label'),
      value: conversationTotals
        ? formatNumber(conversationTotals.totalConversations.value, language)
        : '-',
      description: t('ai_team_performance.total_engagements.description'),
    },
    {
      label: t('ai_team_performance.resolution_rate.label'),
      value: conversationTotals
        ? `${conversationTotals.resolved.percentage}%`
        : '-',
      description: conversationTotals
        ? t('ai_team_performance.resolution_rate.description', {
            count: formatNumber(conversationTotals.resolved.value, language),
          })
        : undefined,
    },
    {
      label: t('ai_team_performance.customer_satisfaction.label'),
      value: csat ? `${csat.highestLabelScore}%` : '-',
      description: csat
        ? t('ai_team_performance.customer_satisfaction.description', {
            count: formatNumber(csat.totalRatings, language),
          })
        : undefined,
    },
  ];
}

interface AITeamPerformanceProps {
  dateRange: DateRange;
}

export function AITeamPerformance({ dateRange }: AITeamPerformanceProps) {
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [conversationTotals, setConversationTotals] =
    useState<ConversationTotals | null>(null);
  const [csat, setCsat] = useState<CSATData | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setIsLoading(true);

      const results = await Promise.allSettled([
        getConversationTotals(dateRange.startDate, dateRange.endDate),
        getCSAT(dateRange.startDate, dateRange.endDate),
      ]);

      if (results[0].status === 'fulfilled') {
        setConversationTotals(results[0].value);
      }

      if (results[1].status === 'fulfilled') {
        setCsat(results[1].value);
      }

      setIsLoading(false);
    }

    fetchMetrics();
  }, [dateRange.startDate, dateRange.endDate]);

  const metrics = buildMetrics(
    conversationTotals,
    csat,
    t,
    i18n.language,
  );

  return (
    <Flex direction="column" gap="$space-4">
      <MetricGrid
        items={metrics}
        columns={3}
        isLoading={isLoading}
        loadingHeight="122px"
        renderItem={(item) => (
          <MetricCard
            label={item.label}
            value={item.value}
            description={item.description}
            tooltipText={item.tooltipText}
          />
        )}
      />
    </Flex>
  );
}
