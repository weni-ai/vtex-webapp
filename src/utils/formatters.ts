const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES',
};

function resolveLocale(language: string): string {
  return LOCALE_MAP[language] ?? 'en-US';
}

export function formatCurrency(
  value: number,
  currencyCode: string,
  language: string,
): string {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

export function formatNumber(value: number, language: string): string {
  return new Intl.NumberFormat(resolveLocale(language)).format(value);
}

export function formatPercentage(value: number, language: string): string {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100);
}
