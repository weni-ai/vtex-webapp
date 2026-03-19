import { useMemo, useState } from 'react';
import type { DateRange, DashboardPeriod } from '../utils';
import {
  DASHBOARD_PERIOD_DEFAULT,
  getDashboardDateRange,
  getLast3MonthsDates,
} from '../utils';

interface UseDashboardDateRangeResult {
  dateRange: DateRange;
  period: DashboardPeriod;
  setPeriod: (period: DashboardPeriod) => void;
  isFilterVisible: boolean;
}

export function useDashboardDateRange(
  isTrialPlan: boolean,
): UseDashboardDateRangeResult {
  const [period, setPeriod] = useState<DashboardPeriod>(
    DASHBOARD_PERIOD_DEFAULT,
  );

  const dateRange = useMemo<DateRange>(() => {
    if (isTrialPlan) return getLast3MonthsDates();
    return getDashboardDateRange(period);
  }, [isTrialPlan, period]);

  return {
    dateRange,
    period,
    setPeriod,
    isFilterVisible: !isTrialPlan,
  };
}
