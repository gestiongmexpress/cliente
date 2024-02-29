import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlagaService } from '../../services/plaga.service'; 
import { Plaga } from '../../models/plaga'; 

@Component({
  selector: 'app-crear-plaga',
  templateUrl: './crear-plaga.component.html',
  styleUrls: ['./crear-plaga.component.css']
})
export class CrearPlagaComponent implements OnInit {
  plagaForm: FormGroup;
  titulo = 'Crear Control de plaga';
  id: string | null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _plagaService: PlagaService,
    private aRouter: ActivatedRoute
  ) {
    this.plagaForm = this.fb.group({
      nombre: ['', Validators.required],
      observacion: [''],
      sucursal: ['', Validators.required],
      mes: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(2023)]],
      encargado: ['', Validators.required],
      prueba: [''],
      fechaRealizacion: [''] 
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  esModoEdicion = false;

  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.id;
    this.esEditar();
  }

  agregarPlaga() {
    if (this.plagaForm.valid) {
      const plaga: Plaga = this.plagaForm.value;
      if (plaga.prueba && plaga.fechaRealizacion) {
        plaga.estado = 'Realizado';
      } else {
        plaga.estado = 'Pendiente';
      }
  
      if (this.id) {
        // Modo edición
        this._plagaService.editarPlaga(this.id, plaga).subscribe(data => {
          this.toastr.info('Control de plaga actualizado', 'El control de plaga fue actualizado con éxito');
          this.router.navigate(['/listar-plagas']);
        }, error => {
          this.toastr.error('Error al actualizar el control de plaga');
        });
      } else {
        // Modo creación
        this._plagaService.guardarPlaga(plaga).subscribe(data => {
          this.toastr.success('Control de plaga registrado', 'El control de plaga fue registrado con éxito');
          this.router.navigate(['/listar-plagas']);
        }, error => {
          this.toastr.error('Error al registrar el control de plaga');
        });
      }
    }
  }

  esEditar() {
    if (this.id) {
      this.titulo = 'Editar Control de plaga';
      this._plagaService.obtenerPlaga(this.id).subscribe(data => {
        const fechaRealizacionFormatted = data.fechaRealizacion ? new Date(data.fechaRealizacion).toISOString().split('T')[0] : '';
        this.plagaForm.patchValue({
          ...data,
          fechaRealizacion: fechaRealizacionFormatted,
        });
      });
    }
  }
}