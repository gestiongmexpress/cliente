import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

formatDate(date: Date | string): string {
  if (!date) {
    return 'No disponible';
  }
  const dateParts = (date instanceof Date ? date.toISOString() : date).split('T')[0].split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);
  const localDate = new Date(year, month, day);
  return `${localDate.getDate()}/${localDate.getMonth() + 1}/${localDate.getFullYear()}`;
}

  formatCustomDate(date: Date | string, format: string, locale: string, timeZone: string = 'UTC'): string {
    if (!date) {
      return 'No disponible';
    }
    const dateObj = new Date(date);
    const utcDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());
    return formatDate(utcDate, format, locale, timeZone);
  }

  formatDayMonth(date: Date | string, locale: string = 'es-ES'): string {
    if (!date) {
      return 'No disponible';
    }
    const format = 'dd MMMM';
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDate(dateObj, format, locale);
  }
}
