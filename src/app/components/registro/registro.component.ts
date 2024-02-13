import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Usuario } from '../../models/usuario'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario: Usuario = new Usuario('', '', ''); 

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  registrar() {
    if (!this.usuario.username || !this.usuario.password || !this.usuario.rol) {
      this.toastr.error('Todos los campos son obligatorios', 'Registro fallido');
      return;
    }
    this.authService.registrarUsuario(this.usuario).subscribe(
      res => {
        console.log('Usuario registrado', res);
        this.toastr.success('Usuario registrado con éxito', 'Registro exitoso');
        setTimeout(() => this.router.navigate(['/login']), 500); 
      },
      err => {
        console.error(err);
        this.toastr.error('Ocurrió un error al registrar el usuario', 'Registro fallido');
      }
    );
  }
  
}