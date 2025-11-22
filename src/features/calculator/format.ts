/**
 * Format number as Norwegian currency (kr)
 * Example: 1234567 → "1 234 567 kr"
 */
export function formatNOK(num: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format number as Norwegian percentage with 1 decimal
 * Example: 5.234 → "5,2 %"
 */
export function formatPercent(num: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100);
}

/**
 * Format number with Norwegian locale (space as thousand separator)
 * Example: 1234567.89 → "1 234 567,89"
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
