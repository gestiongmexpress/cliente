import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: Usuario = new Usuario('', '', '');

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.loginUsuario(this.usuario).subscribe(
      res => {
        localStorage.setItem('token', res.token); 
        this.router.navigate(['/inicio']); 
      },
      err => {
        console.error(err);
        alert('Error de inicio de sesión');
      }
    );
  }
}
