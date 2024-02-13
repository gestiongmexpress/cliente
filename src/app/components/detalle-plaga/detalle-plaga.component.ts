import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlagaService } from '../../services/plaga.service';
import { Plaga } from '../../models/plaga';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-detalle-plaga',
  templateUrl: './detalle-plaga.component.html',
  styleUrls: ['./detalle-plaga.component.css']
})
export class DetallePlagaComponent implements OnInit {
  plaga!: Plaga;
  id: string | null = null;
  fechaRealizacionFormatted: string = '';
  fechaCreacionFormatted: string = '';
  rolUsuario: string = '';

  constructor(
    private plagaService: PlagaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.obtenerRolUsuario();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.plagaService.obtenerPlaga(this.id).subscribe((plaga: Plaga) => {
        this.plaga = plaga;
        if (this.plaga.fechaRealizacion) {
          this.fechaRealizacionFormatted = this.formatDate(this.plaga.fechaRealizacion);
        }
        if (this.plaga.fechaCreacion) {
          this.fechaCreacionFormatted = this.formatDate(this.plaga.fechaCreacion);
        }
      }, error => {
        console.error('Error al obtener la mantención', error);
      });
    } else {
      console.error('No se proporcionó un ID válido para la mantención');
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
