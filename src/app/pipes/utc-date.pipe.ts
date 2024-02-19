import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Convierte la cadena de fecha a una fecha local
    const date = new Date(value);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
  }
}