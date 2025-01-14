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

export function addMonths(date: Date, months: number) {
  date.setMonth(date.getMonth() + months);
  return date;
}

/*
 * This function identifies the first letter of each word in a string
 * and returns them in uppercase
 * 
 * It is used to simplify the project chart labels
 */
export function getInitials(str: string) {
  return str.split(' ').map(word => word[0].toUpperCase()).join('');
}
