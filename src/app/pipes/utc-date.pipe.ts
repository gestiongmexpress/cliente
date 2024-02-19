import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    
    let date: Date;
    
    // Si 'value' es una cadena, conviértela a fecha
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    // Convierte la fecha a UTC aplicando el desfase horario
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const utcDate = new Date(date.getTime() + userTimezoneOffset);

    // Devuelve la fecha en formato local sin tiempo
    return utcDate.toISOString().split('T')[0];
  }
}
