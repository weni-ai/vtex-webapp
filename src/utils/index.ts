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

export async function fileToBase64(file: File) {
  try {
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
  } catch (error) {
    throw error;
  }
}

export async function useCache({ cacheKey, getResponse }: { cacheKey: string, getResponse: () => Promise<any> }) {
  const cachedResponse = moduleStorage.getItem(cacheKey);

  if (cachedResponse) {
    const { expiresAt, response } = JSON.parse(cachedResponse);

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
