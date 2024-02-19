import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreMes'
})
export class NombreMesPipe implements PipeTransform {
  transform(value: string | number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    if (typeof value === 'number') {
      return meses[value];
    } else {
      const index = meses.findIndex(mes => mes.toLowerCase().startsWith(value.toLowerCase()));
      return index !== -1 ? meses[index] : 'Mes inválido';
    }
  }
}
