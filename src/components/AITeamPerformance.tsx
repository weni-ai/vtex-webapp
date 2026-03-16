import { Flex, Text } from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConversationTotals, Revenue, CSATData } from '../api/insights/adapters';
import {
  getConversationTotals,
  getRevenue,
  getCSAT,
} from '../services/insights.service';
import { getLast3MonthsDates } from '../utils';
import { MetricCard, type MetricCardProps } from './MetricCard';
import { MetricGrid } from './MetricGrid';

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES',
};

function formatCurrency(
  value: number,
  currencyCode: string,
  language: string,
): string {
  const locale = LOCALE_MAP[language] ?? 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

function formatNumber(value: number, language: string): string {
  const locale = LOCALE_MAP[language] ?? 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

function buildMetrics(
  conversationTotals: ConversationTotals | null,
  revenue: Revenue | null,
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
      label: t('ai_team_performance.revenue.label'),
      value: revenue
        ? formatCurrency(revenue.value, revenue.currencyCode, language)
        : '-',
      description: revenue
        ? t('ai_team_performance.revenue.description', {
            count: formatNumber(revenue.ordersPlaced.value, language),
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

export function AITeamPerformance() {
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [conversationTotals, setConversationTotals] =
    useState<ConversationTotals | null>(null);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [csat, setCsat] = useState<CSATData | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setIsLoading(true);

      const { startDate, endDate } = getLast3MonthsDates();

      const results = await Promise.allSettled([
        getConversationTotals(startDate, endDate),
        getRevenue(startDate, endDate),
        getCSAT(startDate, endDate),
      ]);

      if (results[0].status === 'fulfilled') {
        setConversationTotals(results[0].value);
      }

      if (results[1].status === 'fulfilled') {
        setRevenue(results[1].value);
      }

      if (results[2].status === 'fulfilled') {
        setCsat(results[2].value);
      }

      setIsLoading(false);
    }

    fetchMetrics();
  }, []);

  const metrics = buildMetrics(
    conversationTotals,
    revenue,
    csat,
    t,
    i18n.language,
  );

  return (
    <Flex direction="column" gap="$space-4">
      <Text variant="display2">
        {t('ai_team_performance.title')}
      </Text>

      <MetricGrid
        items={metrics}
        columns={4}
        isLoading={isLoading}
        loadingHeight="110px"
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
