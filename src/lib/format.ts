export function formatCurrency(amount: number, currency = 'AUD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function gainLossColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-500';
}

export function gainLossBg(value: number): string {
  if (value > 0) return 'bg-green-50 border-green-200 text-green-700';
  if (value < 0) return 'bg-red-50 border-red-200 text-red-700';
  return 'bg-gray-100 border-gray-200 text-gray-600';
}

export const CURRENCIES = [
  { code: 'AUD', label: 'AUD — Australian Dollar' },
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'GBP', label: 'GBP — British Pound' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'CAD', label: 'CAD — Canadian Dollar' },
  { code: 'NZD', label: 'NZD — New Zealand Dollar' },
  { code: 'SGD', label: 'SGD — Singapore Dollar' },
  { code: 'JPY', label: 'JPY — Japanese Yen' },
  { code: 'HKD', label: 'HKD — Hong Kong Dollar' },
];
