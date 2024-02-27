import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Trabajador } from '../../models/trabajador'; 
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  nombreUsuario: string = '';
  rol: string = '';
  mostrarRegistro: boolean = false;
  mostrarListaTrabajadores = false;
  mostrarListarCapacitaciones: boolean = false; 
  mostrarListarMantenciones = false;
  mostrarListaPlagas = false;
  mostrarNotificaciones = false;
  trabajadoresConContratoPr: Trabajador[] = [];
  trabajadoresConCumplePr: Trabajador[] = [];
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private router: Router, private trabajadorService: TrabajadorService, public dateFormatService: DateFormatService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
      const payload = JSON.parse(window.atob(base64)); 
      this.nombreUsuario = payload.username;
      this.rol = payload.rol; 
      const rolesRegistro = ['Administrador', 'Gerente'];
      const rolesNotificaciones = ['Administrador', 'Gerente'];
      const rolesListarCapacitaciones = ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'];
      const rolesListarMantenciones = ['Administrador', 'Gerente', 'Enc. Logistica'];
      const rolesListarPlagas = ['Administrador', 'Gerente', 'Nutricionista'];
      this.mostrarRegistro = rolesRegistro.includes(this.rol);
      this.mostrarListaTrabajadores = rolesRegistro.includes(this.rol);
      this.mostrarListaPlagas = rolesListarPlagas.includes(this.rol);
      this.mostrarListarCapacitaciones = rolesListarCapacitaciones.includes(this.rol);
      this.mostrarListarMantenciones = rolesListarMantenciones.includes(this.rol);

      if (rolesNotificaciones.includes(this.rol)) {
        this.obtenerTrabajadoresConContratoPr();
        this.obtenerTrabajadoresConCumplePr();
      }
    }
  }

  obtenerTrabajadoresConContratoPr() {
    this.trabajadorService.proximoVencimientoContrato().subscribe({
      next: (trabajadores) => {
        this.trabajadoresConContratoPr = trabajadores;
        this.actualizarMostrarNotificaciones();
      },
      error: (error) => {
        console.error('Error al cargar trabajadores con contrato próximo a vencer', error);
      }
    });
  }
  
  obtenerTrabajadoresConCumplePr() {
    this.trabajadorService.proximoCumpleanos().subscribe({
      next: (trabajadores) => {
        this.trabajadoresConCumplePr = trabajadores;
        this.actualizarMostrarNotificaciones();
      },
      error: (error) => {
        console.error('Error al cargar trabajadores con cumpleaños próximos', error);
      }
    });
  }
  
  actualizarMostrarNotificaciones() {
    this.mostrarNotificaciones = this.trabajadoresConContratoPr.length > 0 || this.trabajadoresConCumplePr.length > 0;
  }  

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}