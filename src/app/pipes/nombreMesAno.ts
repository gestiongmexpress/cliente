import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreMesAno'
})
export class NombreMesAnoPipe implements PipeTransform {
  transform(value: string): string {
    const [mes, año] = value.split('-');
    const nombreMes = new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(+año, +mes));
    return `${nombreMes} ${año}`;
  }
}
