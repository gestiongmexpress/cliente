import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
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

  constructor(private trabajadorService: TrabajadorService) {}

  ngOnInit(): void {
    this.trabajadorService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.organizarTerminos();
    });
  }

  private organizarTerminos(): void {
    // Obtener la fecha de hoy
    const ahora = new Date();
    
    // Filtra solo los trabajadores con fechaTerminoContrato definida
    const trabajadoresConTermino = this.trabajadores.filter(t => t.fechaTerminoContrato)
      .map(t => ({
        ...t,
        fechaTerminoContrato: new Date(t.fechaTerminoContrato!)
      }))
      .sort((a, b) => a.fechaTerminoContrato!.getTime() - b.fechaTerminoContrato!.getTime());
    
    // Ordena por los términos de contrato más próximos y guarda los primeros 3
    this.terminosProximos = trabajadoresConTermino.slice(0, 3);
    
    // Agrupa los términos de contrato por mes y año
    trabajadoresConTermino.forEach(t => {
      const mes = t.fechaTerminoContrato!.getMonth();
      const año = t.fechaTerminoContrato!.getFullYear();
      const key = `${mes}-${año}`;
  
      if (!this.terminosPorMes[key]) {
        this.terminosPorMes[key] = [];
      }
      this.terminosPorMes[key].push(t);
    });
    
    this.trabajadoresSinTermino = this.trabajadores.filter(t => !t.fechaTerminoContrato);
  }
  

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
