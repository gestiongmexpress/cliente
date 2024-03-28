import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MantencionService } from '../../services/mantencion.service';
import { Mantencion } from '../../models/mantencion';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-detalle-mantencion',
  templateUrl: './detalle-mantencion.component.html',
  styleUrls: ['./detalle-mantencion.component.css']
})
export class DetalleMantencionComponent implements OnInit {
  mantencion: Mantencion = {
    nombre: '',
    sucursal: '',
    observacion: '',
    codigo: '',
    area: '',
    mes:  '',
    ano: 0,
    encargado: '',
    proveedor: '',
    estado: ''
  }
  id: string | null = null;
  fechaRealizacionFormatted: string = '';
  fechaCreacionFormatted: string = '';
  rolUsuario: string = '';
  filtroSucursal: string = '';
  filtroAno: string = '';
  filtroArea: string = '';

  constructor(
    private mantencionService: MantencionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.obtenerRolUsuario();
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.filtroSucursal = params['sucursal'] || '';
      this.filtroAno = params['ano'] || '';
      this.filtroArea = params['area'] || '';
    });
  
    if (this.id) {
      this.mantencionService.obtenerMantencion(this.id).subscribe((mantencion: Mantencion) => {
        this.mantencion = mantencion;
        if (this.mantencion.fechaRealizacion) {
          this.fechaRealizacionFormatted = this.formatDate(this.mantencion.fechaRealizacion);
        }
        if (this.mantencion.fechaCreacion) {
          this.fechaCreacionFormatted = this.formatDate(this.mantencion.fechaCreacion);
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
