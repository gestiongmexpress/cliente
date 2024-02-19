import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
      const payload = JSON.parse(window.atob(base64)); 
      this.nombreUsuario = payload.username;
      this.rol = payload.rol; 
      const rolesRegistro = ['Administrador', 'Gerente'];
      const rolesListarCapacitaciones = ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'];
      const rolesListarMantenciones = ['Administrador', 'Gerente', 'Enc. Logistica'];
      const rolesListarPlagas = ['Administrador', 'Gerente', 'Nutricionista'];
      this.mostrarRegistro = rolesRegistro.includes(this.rol);
      this.mostrarListaTrabajadores = rolesRegistro.includes(this.rol);
      this.mostrarListaPlagas = rolesListarPlagas.includes(this.rol);
      this.mostrarListarCapacitaciones = rolesListarCapacitaciones.includes(this.rol);
      this.mostrarListarMantenciones = rolesListarMantenciones.includes(this.rol);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
