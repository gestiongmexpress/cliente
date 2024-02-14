import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuarioForm: FormGroup;
  titulo = 'Registrar Usuario';
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required]
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar(): void {
    if (this.id) {
      this.titulo = 'Editar Usuario';
      this.authService.obtenerUsuario(this.id).subscribe(
        data => {
          this.usuarioForm.setValue({
            username: data.username,
            password: '', // No cargamos la contraseña por seguridad
            rol: data.rol
          });
        },
        err => {
          console.error(err);
          this.toastr.error('Error al obtener los datos del usuario', 'Error');
        }
      );
    }
  }

  registrarOActualizar(): void {
    if (this.usuarioForm.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (this.id) {
      // Modo edición
      this.authService.actualizarUsuario(this.id, this.usuarioForm.value).subscribe(
        res => {
          this.toastr.success('Usuario actualizado con éxito', 'Actualización exitosa');
          this.router.navigate(['/listar-usuarios']);
        },
        err => {
          console.error(err);
          this.toastr.error('Ocurrió un error al actualizar el usuario', 'Error de actualización');
        }
      );
    } else {
      // Modo registro
      this.authService.registrarUsuario(this.usuarioForm.value).subscribe(
        res => {
          this.toastr.success('Usuario registrado con éxito', 'Registro exitoso');
          this.router.navigate(['/listar-usuarios']);
        },
        err => {
          console.error(err);
          this.toastr.error('Ocurrió un error al registrar el usuario', 'Error de registro');
        }
      );
    }
  }
}