import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitacionService } from '../../services/capacitacion.service';
import { Capacitacion } from '../../models/capacitacion';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-detalle-capacitacion',
  templateUrl: './detalle-capacitacion.component.html',
  styleUrls: ['./detalle-capacitacion.component.css']
})
export class DetalleCapacitacionComponent implements OnInit {
  capacitacion!: Capacitacion;
  id: string | null = null;
  fechaRealizacionFormatted: string = '';
  diaRealizacionFormatted: string = '';
  rolUsuario: string = '';

  constructor(
    private capacitacionService: CapacitacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.obtenerRolUsuario();
    const id = this.route.snapshot.paramMap.get('id');
    this.capacitacion = new Capacitacion('', '', '', '', 0, '');
    if (id) {
      this.id = id;
      this.capacitacionService.obtenerCapacitacion(this.id).subscribe((capacitacion: Capacitacion) => {
        this.capacitacion = capacitacion;
        if (this.capacitacion.fechaRealizacion) {
          this.fechaRealizacionFormatted = this.formatDate(this.capacitacion.fechaRealizacion);
        }
        if (this.capacitacion.diaRealizado) {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          this.diaRealizacionFormatted = this.formatCustomDate(this.capacitacion.diaRealizado, 'dd-MM-yyyy', 'en-US', 'America/Santiago');
        }
      });
    } else {
      console.error('No se proporcionó un ID válido para la capacitación');
    }
  }
  obtenerRolUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      this.rolUsuario = decodedPayload.rol;
    }
  }

  formatDate(date: Date | string): string {
    if (!date) {
      return 'No disponible';
    }
    return formatDate(date, 'dd-MM-yyyy', 'en-US');
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