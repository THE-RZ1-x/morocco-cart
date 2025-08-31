// Currency formatting utilities for Moroccan Dirham
export const formatPrice = (price, locale = 'ar-MA') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPriceSimple = (price) => {
  return `${price.toFixed(2)} درهم`;
};

export const convertUSDToMAD = (usdPrice, exchangeRate = 10.2) => {
  return usdPrice * exchangeRate;
};