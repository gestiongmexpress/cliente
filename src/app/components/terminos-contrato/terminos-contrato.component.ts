import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
import { DateFormatService } from '../../services/date-format.service';
import { Trabajador } from '../../models/trabajador';

@Component({
  selector: 'app-terminos-contrato',
  templateUrl: './terminos-contrato.component.html',
  styleUrls: ['./terminos-contrato.component.css']
})
export class TerminosContratoComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  terminosProximos: Trabajador[] = [];
  terminosPorMes: { [key: string]: Trabajador[] } = {};
  trabajadoresSinTermino: Trabajador[] = [];

  constructor(private trabajadorService: TrabajadorService, private dateFormatService: DateFormatService) {}

  ngOnInit(): void {
    this.trabajadorService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.organizarTerminos();
    });
  }

  private organizarTerminos(): void {
    const ahora = new Date();
    const nombresDeMeses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const trabajadoresConTermino = this.trabajadores
      .filter(t => t.fechaTerminoContrato && new Date(t.fechaTerminoContrato) > ahora)
      .map(t => ({ ...t, fechaTerminoContrato: new Date(t.fechaTerminoContrato!) }))
      .sort((a, b) => a.fechaTerminoContrato!.getTime() - b.fechaTerminoContrato!.getTime());
    this.terminosProximos = trabajadoresConTermino.slice(0, 3);
    this.terminosPorMes = {};
    trabajadoresConTermino.forEach(t => {
      const mes = t.fechaTerminoContrato!.getMonth();
      const año = t.fechaTerminoContrato!.getFullYear();
      const key = `${nombresDeMeses[mes]}-${año}`;
      if (!this.terminosPorMes[key]) {
        this.terminosPorMes[key] = [];
      }
      this.terminosPorMes[key].push(t);
    });
    this.trabajadoresSinTermino = this.trabajadores.filter(t => !t.fechaTerminoContrato || new Date(t.fechaTerminoContrato) <= ahora);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getFormattedDate(date: Date | string): string {
    return this.dateFormatService.formatDate(date);
  }
}