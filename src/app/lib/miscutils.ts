/*
 * This file contains some utility functions
 * 
 * They are not related to the business logic of the project
 * but they are useful for formatting, etc
 */
export const formatCurrency = (amount?: number) => {
  if (!amount) amount = 0;
  if (amount < 1000) {
    return amount.toLocaleString('en-UK', {
      style: 'currency',
      currency: 'EUR',
    });
  }
  else {
    return (amount/1000) + "K"
  }
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
