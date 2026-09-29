import { CurrencyCode } from '../types/travel';

export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const rounded = Math.round(amount);
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rounded);
  }

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(rounded);
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(rounded);
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function parseBudgetInput(input: string): number {
  // Strip currency symbols, commas, spaces, letters
  const cleaned = input.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateBudgetPercentage(used: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 1000) / 10);
}
