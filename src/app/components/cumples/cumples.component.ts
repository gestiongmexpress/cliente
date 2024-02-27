import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-cumples',
  templateUrl: './cumples.component.html',
  styleUrls: ['./cumples.component.css'] 
})
export class CumplesComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  cumpleaniosPorMes: { [key: string]: Trabajador[] } = {};
  cumpleaniosProximo: Trabajador | null = null;
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private trabajadorService: TrabajadorService, public dateFormatService: DateFormatService) {}

  ngOnInit(): void {
    this.trabajadorService.getTrabajadores().subscribe(data => {
      this.trabajadores = data.map(trabajador => ({
        ...trabajador,
        fechaNacimiento: new Date(trabajador.fechaNacimiento)
      }));
      this.organizarCumpleanios();
      this.encontrarCumpleaniosProximo();
    });
  }
  

  private organizarCumpleanios(): void {
    this.cumpleaniosPorMes = {}; 
    this.trabajadores.forEach(trabajador => {
      const mes = trabajador.fechaNacimiento.getUTCMonth();
      if (!this.cumpleaniosPorMes[mes]) {
        this.cumpleaniosPorMes[mes] = [];
      }
      this.cumpleaniosPorMes[mes].push(trabajador);
      this.cumpleaniosPorMes[mes].sort((a, b) => a.fechaNacimiento.getUTCDate() - b.fechaNacimiento.getUTCDate());
    });
  }
  
  private encontrarCumpleaniosProximo(): void {
    const hoy = new Date(Date.now()); 
    const hoyUTC = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())); 
    let cumpleaniosProximos: Trabajador[] = [];
  
    this.trabajadores.forEach(trabajador => {
      const fechaCumple = new Date(Date.UTC(
        hoyUTC.getFullYear(),
        trabajador.fechaNacimiento.getUTCMonth(),
        trabajador.fechaNacimiento.getUTCDate()
      ));
  
      if (fechaCumple >= hoyUTC) {
        cumpleaniosProximos.push(trabajador);
      }
    });
  
    cumpleaniosProximos.sort((a, b) => {
      const fechaA = new Date(Date.UTC(
        hoyUTC.getFullYear(),
        a.fechaNacimiento.getUTCMonth(),
        a.fechaNacimiento.getUTCDate()
      ));
      const fechaB = new Date(Date.UTC(
        hoyUTC.getFullYear(),
        b.fechaNacimiento.getUTCMonth(),
        b.fechaNacimiento.getUTCDate()
      ));
      return fechaA.getTime() - fechaB.getTime();
    });
  
    this.cumpleaniosProximo = cumpleaniosProximos.length > 0 ? cumpleaniosProximos[0] : null;
  }
  
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}