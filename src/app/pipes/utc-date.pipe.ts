import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return ''; // Retorna una cadena vacía si el valor es undefined o nulo

    let date: Date;
    if (typeof value === 'string') {
      // Asume que la fecha en string está en UTC y la convierte a un objeto Date
      date = new Date(value + 'Z'); // Añade 'Z' para indicar que es UTC
    } else {
      date = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    }

    // No se realiza ningún ajuste por zona horaria aquí, simplemente se formatea la fecha
    return date.toISOString().split('T')[0];
  }
}