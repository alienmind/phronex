/*
 * This file contains some utility functions
 * 
 * They are not related to the business logic of the project
 * but they are useful for formatting, etc
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-UK', {
    style: 'currency',
    currency: 'EUR',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};