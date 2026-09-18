import { CurrencyCode, Language } from '../types';

export interface CurrencyDetails {
  code: CurrencyCode;
  symbol: string;
  symbolAr: string;
  nameEn: string;
  nameAr: string;
  rate: number; // 1 USD = rate in target currency
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDetails> = {
  USD: {
    code: 'USD',
    symbol: '$',
    symbolAr: '$',
    nameEn: 'US Dollar',
    nameAr: 'دولار أمريكي',
    rate: 1.0,
    flag: '🇺🇸',
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    symbolAr: 'ر.س',
    nameEn: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    rate: 3.75,
    flag: '🇸🇦',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    symbolAr: '€',
    nameEn: 'Euro',
    nameAr: 'يورو أوروبي',
    rate: 0.92,
    flag: '🇪🇺',
  },
  IQD: {
    code: 'IQD',
    symbol: 'IQD',
    symbolAr: 'د.ع',
    nameEn: 'Iraqi Dinar',
    nameAr: 'دينار عراقي',
    rate: 1310,
    flag: '🇮🇶',
  },
};

export function convertPrice(amountUSD: number, targetCurrency: CurrencyCode | string = 'USD'): number {
  const num = typeof amountUSD === 'number' && !isNaN(amountUSD) ? amountUSD : 0;
  const code = (targetCurrency in CURRENCIES ? targetCurrency : 'USD') as CurrencyCode;
  const rate = CURRENCIES[code]?.rate ?? 1.0;
  return num * rate;
}

export function formatPrice(
  amountUSD: number,
  targetCurrency: CurrencyCode | string = 'USD',
  lang: Language = 'ar',
  options?: { showUnit?: boolean; unit?: string }
): string {
  const num = typeof amountUSD === 'number' && !isNaN(amountUSD) ? amountUSD : 0;
  const code = (targetCurrency in CURRENCIES ? targetCurrency : 'USD') as CurrencyCode;
  const currencyInfo = CURRENCIES[code] || CURRENCIES.USD;
  const converted = num * (currencyInfo.rate || 1.0);
  const symbol = lang === 'ar' ? (currencyInfo.symbolAr || '$') : (currencyInfo.symbol || '$');
  
  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedStr = lang === 'ar' ? `${formattedNumber} ${symbol}` : `${symbol}${formattedNumber}`;

  if (options?.showUnit && options.unit) {
    return `${formattedStr} / ${options.unit}`;
  }

  return formattedStr;
}
