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

  // Crear un objeto de fecha a partir del string ISO sin convertirlo a la hora local
  const dateParts = (date instanceof Date ? date.toISOString() : date).split('T')[0].split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
  const day = parseInt(dateParts[2], 10);

  // Crear una nueva fecha usando el constructor de Date con año, mes y día
  const localDate = new Date(year, month, day);

  // Formatear la fecha como desees, aquí es solo un ejemplo básico
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
}
