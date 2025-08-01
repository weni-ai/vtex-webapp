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
