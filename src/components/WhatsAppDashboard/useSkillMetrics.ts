import { useEffect, useRef, useState } from 'react';
import type { SkillMetricsData } from '../../api/agents/adapters';
import { getSkillMetrics } from '../../services/agent.service';
import type { DateRange } from '../../utils';

interface UseSkillMetricsResult {
  isLoading: boolean;
  isInitialLoading: boolean;
  data: SkillMetricsData | null;
  hasValidData: boolean;
}

function buildRangeKey(dateRange: DateRange): string {
  return `${dateRange.startDate}:${dateRange.endDate}`;
}

function isValidSkillMetrics(data: SkillMetricsData): boolean {
  return !data.error && data.data.length > 0;
}

export function useSkillMetrics(dateRange: DateRange): UseSkillMetricsResult {
  const [data, setData] = useState<SkillMetricsData | null>(null);
  const [lastFetchedRangeKey, setLastFetchedRangeKey] = useState<string | null>(null);
  const hasCompletedInitialFetch = useRef(false);

  const rangeKey = buildRangeKey(dateRange);
  const isLoading = lastFetchedRangeKey !== rangeKey;

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const result = await getSkillMetrics({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        if (cancelled) return;

        if ('success' in result) {
          setData(null);
          return;
        }

        setData(isValidSkillMetrics(result) ? result : null);
      } catch {
        if (cancelled) return;
        setData(null);
      } finally {
        if (!cancelled) {
          hasCompletedInitialFetch.current = true;
          setLastFetchedRangeKey(rangeKey);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [rangeKey, dateRange.startDate, dateRange.endDate]);

  return {
    isLoading,
    isInitialLoading: !hasCompletedInitialFetch.current,
    data,
    hasValidData: data !== null,
  };
}
