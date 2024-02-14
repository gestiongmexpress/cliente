import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.authService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (e) => console.error(e)
    });
  }

  editarUsuario(id: string): void {
    // Redirigir al usuario a la ruta de edición de usuarios
    this.router.navigate(['/editar-usuario', id]);
  }

  eliminarUsuario(id: string): void {
    const confirmacion = confirm('¿Estás seguro de querer eliminar al usuario?');
    if (confirmacion) {
      this.authService.eliminarUsuario(id).subscribe({
        next: () => {
          // Recargar la lista de usuarios después de eliminar uno
          this.cargarUsuarios();
        },
        error: (e) => console.error(e)
      });
    }
  }
}
