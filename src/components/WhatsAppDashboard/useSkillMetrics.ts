import { useEffect, useState } from 'react';
import type { SkillMetricsData } from '../../api/agents/adapters';
import { getSkillMetrics } from '../../services/agent.service';
import { getLast3MonthsDates } from '../../utils';

interface UseSkillMetricsResult {
  isLoading: boolean;
  data: SkillMetricsData | null;
  hasValidData: boolean;
}

function isValidSkillMetrics(data: SkillMetricsData): boolean {
  return !data.error && data.data.length > 0;
}

export function useSkillMetrics(): UseSkillMetricsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<SkillMetricsData | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const { startDate, endDate } = getLast3MonthsDates();
        const result = await getSkillMetrics({ startDate, endDate });

        if ('success' in result) {
          setData(null);
          return;
        }

        setData(isValidSkillMetrics(result) ? result : null);
      } catch {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    isLoading,
    data,
    hasValidData: data !== null,
  };
}
