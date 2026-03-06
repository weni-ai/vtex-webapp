import { Flex, Skeleton, Text } from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Revenue, MessagesAnalytics } from '../api/insights/adapters';
import type { MetaPricing } from '../api/billing/adapters';
import { getRevenue, getMessagesAnalytics } from '../services/insights.service';
import { getMetaPricing } from '../services/billing.service';
import { getLast3MonthsDates } from '../utils';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface AbandonedCartMetrics {
  recoveredRevenue: number;
  currencyCode: string;
  convertedSales: number;
  totalSends: number;
  averageOrderValue: number;
  conversionRate: number;
  cost: number;
  roi: number;
}

function computeMetrics(
  revenue: Revenue,
  messages: MessagesAnalytics,
  pricing: MetaPricing,
): AbandonedCartMetrics {
  const recoveredRevenue = revenue.value;
  const currencyCode = revenue.currencyCode;
  const convertedSales = revenue.ordersPlaced.value;
  const totalSends = messages.sent;

  const averageOrderValue =
    convertedSales > 0 ? recoveredRevenue / convertedSales : 0;

  const conversionRate =
    totalSends > 0 ? (convertedSales / totalSends) * 100 : 0;

  const cost = totalSends * pricing.rates.marketing;

  const roi = cost > 0 ? ((recoveredRevenue - cost) / cost) * 100 : 0;

  return {
    recoveredRevenue,
    currencyCode,
    convertedSales,
    totalSends,
    averageOrderValue,
    conversionRate,
    cost,
    roi,
  };
}

function useAbandonedCartData() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<AbandonedCartMetrics | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const { startDate, endDate } = getLast3MonthsDates();

      const results = await Promise.allSettled([
        getRevenue(startDate, endDate),
        getMessagesAnalytics(startDate, endDate),
        getMetaPricing(),
      ]);

      const revenue =
        results[0].status === 'fulfilled' ? results[0].value : null;
      const messages =
        results[1].status === 'fulfilled' ? results[1].value : null;
      const pricing =
        results[2].status === 'fulfilled' ? results[2].value : null;

      if (revenue && messages && pricing) {
        setMetrics(computeMetrics(revenue, messages, pricing));
      }

      setIsLoading(false);
    }

    fetchData();
  }, []);

  return { isLoading, metrics };
}

interface SecondaryMetricProps {
  label: string;
  value: string;
}

function SecondaryMetric({ label, value }: SecondaryMetricProps) {
  return (
    <Flex
      direction="column"
      gap="$space-2"
      style={{ flex: '1 0 0', minWidth: 0 }}
    >
      <Text
        variant="body"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        color="$fg-base-soft"
      >
        {label}
      </Text>
      <Text variant="display2" color="$fg-base">
        {value}
      </Text>
    </Flex>
  );
}

export function AbandonedCartRecovery() {
  const { t, i18n } = useTranslation();
  const { isLoading, metrics } = useAbandonedCartData();
  const language = i18n.language;

  if (isLoading) {
    return <Skeleton width="100%" height="230px" />;
  }

  const recoveredRevenue = metrics
    ? formatCurrency(metrics.recoveredRevenue, metrics.currencyCode, language)
    : '-';

  const roiValue = metrics ? Math.round(metrics.roi) : null;
  const roiLabel =
    roiValue !== null
      ? `${t('abandoned_cart_recovery.roi')}: ${formatNumber(roiValue, language)}%`
      : null;

  const totalSends = metrics
    ? formatNumber(metrics.totalSends, language)
    : '-';

  const convertedSales = metrics
    ? formatNumber(metrics.convertedSales, language)
    : '-';

  const conversionRate = metrics
    ? `${Math.round(metrics.conversionRate)}%`
    : '-';

  const averageOrderValue = metrics
    ? formatCurrency(metrics.averageOrderValue, metrics.currencyCode, language)
    : '-';

  return (
    <Flex
      direction="column"
      gap="$space-6"
      style={{
        border: '$border-base',
        borderRadius: '$radius-2',
        padding: '$space-6',
      }}
    >
      <Text variant="display3" color="$fg-base">
        {t('abandoned_cart_recovery.title')}
      </Text>

      <Flex direction="column" gap="$space-4">
        <Flex align="start" justify="space-between">
          <Flex direction="column" gap="$space-2">
            <Text
              variant="body"
              color="$fg-base-soft"
            >
              {t('abandoned_cart_recovery.recovered_revenue')}
            </Text>
            <Text variant="display1" color="$fg-base">
              {recoveredRevenue}
            </Text>
          </Flex>

          {roiLabel && (
            <Text
              variant="emphasis"
              color={roiValue !== null && roiValue >= 0 ? '$fg-success' : '$fg-error'}
              style={{
                backgroundColor: roiValue !== null && roiValue >= 0 ? '$color-green-3' : '$color-red-3',
                padding: '$space-1 $space-2',
                borderRadius: '$radius-1',
              }}
            >
              {roiLabel}
            </Text>
          )}
        </Flex>

        <Flex gap="$space-0" style={{ gap: '50px' }}>
          <SecondaryMetric
            label={t('abandoned_cart_recovery.total_sends')}
            value={totalSends}
          />
          <SecondaryMetric
            label={t('abandoned_cart_recovery.converted_sales')}
            value={convertedSales}
          />
        </Flex>

        <Flex gap="$space-0" style={{ gap: '50px' }}>
          <SecondaryMetric
            label={t('abandoned_cart_recovery.conversion_rate')}
            value={conversionRate}
          />
          <SecondaryMetric
            label={t('abandoned_cart_recovery.average_order_value')}
            value={averageOrderValue}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
