import { moduleStorage } from "./storage";

export function cleanURL(url: string) {
  return url.trim().replace(/^https?:\/\//, '');
}

export function getPeriodDates(period: 'today' | 'yesterday' | 'last 7 days' | 'last 28 days') {
  const toISODate = (date: Date) => date.toISOString().split('T')[0];

  const getStartAndEndDates = (daysAgo: number, includeToday: boolean = true) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);
    return {
      startDate: toISODate(start),
      endDate: toISODate(includeToday ? end : start),
    };
  };

  const periodMap: Record<typeof period, () => { startDate: string; endDate: string }> = {
    'today': () => getStartAndEndDates(0),
    'yesterday': () => getStartAndEndDates(1, false),
    'last 7 days': () => getStartAndEndDates(7),
    'last 28 days': () => getStartAndEndDates(28),
  };

  return periodMap[period]();
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type DashboardPeriod = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month';

export const DASHBOARD_PERIOD_DEFAULT: DashboardPeriod = 'last_7_days';

export function getDashboardDateRange(period: DashboardPeriod): DateRange {
  const toISODate = (date: Date) => date.toISOString().split('T')[0];
  const now = new Date();

  switch (period) {
    case 'today': {
      const dateStr = toISODate(now);
      return { startDate: dateStr, endDate: dateStr };
    }
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const dateStr = toISODate(yesterday);
      return { startDate: dateStr, endDate: dateStr };
    }
    case 'last_7_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return { startDate: toISODate(start), endDate: toISODate(now) };
    }
    case 'last_30_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return { startDate: toISODate(start), endDate: toISODate(now) };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toISODate(start), endDate: toISODate(now) };
    }
  }
}

export function getLast3MonthsDates(): DateRange {
  const toISODate = (date: Date) => date.toISOString().split('T')[0];

  const end = new Date();
  const start = new Date();
  // -89 (3 months) due to the fact that the start date is inclusive and the end date is exclusive
  start.setDate(start.getDate() - 89);

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  };
}

export async function fileToBase64(file: File) {
  return new Promise((resolve: (result: string) => void, reject: (error: Error) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error as unknown as Error);
    };
    reader.readAsDataURL(file);
  });
}

export async function useCache({ cacheKey, getResponse }: { cacheKey: string, getResponse: () => Promise<any> }) {
  const cachedResponse = moduleStorage.getItem(cacheKey);

  if (cachedResponse) {
    const { expiresAt, response } = cachedResponse;

    if (expiresAt > Date.now()) {
      return { response, saveCache: () => { } };
    }
  }

  const response = await getResponse();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  return {
    response,
    saveCache: () => {
      moduleStorage.setItem(cacheKey, JSON.stringify({
        expiresAt,
        response,
      }));
    }
  };
}
