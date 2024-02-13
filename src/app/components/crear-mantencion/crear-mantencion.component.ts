import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MantencionService } from '../../services/mantencion.service'; 
import { Mantencion } from '../../models/mantencion'; 

@Component({
  selector: 'app-crear-mantencion',
  templateUrl: './crear-mantencion.component.html',
  styleUrls: ['./crear-mantencion.component.css']
})
export class CrearMantencionComponent implements OnInit {
  mantencionForm: FormGroup;
  titulo = 'Crear Mantención';
  id: string | null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _mantencionService: MantencionService,
    private aRouter: ActivatedRoute
  ) {
    this.mantencionForm = this.fb.group({
      nombre: ['', Validators.required],
      observacion: [''],
      codigo: [''],
      sucursal: ['', Validators.required],
      mes: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(2023)]],
      area: ['', Validators.required],
      encargado: ['', Validators.required],
      proveedor: [''],
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

  agregarMantencion() {
    if (this.mantencionForm.valid) {
      const mantencion: Mantencion = this.mantencionForm.value;
  
      // Cambiar el estado a 'Realizado' si se han proporcionado proveedor y fecha de realización
      if (mantencion.proveedor && mantencion.fechaRealizacion) {
        mantencion.estado = 'Realizado';
      } else {
        mantencion.estado = 'Pendiente';
      }
  
      if (this.id) {
        // Modo edición: actualiza la mantención existente
        this._mantencionService.editarMantencion(this.id, mantencion).subscribe(data => {
          this.toastr.info('Mantención actualizada', 'La mantención fue actualizada con éxito');
          this.router.navigate(['/listar-mantencion']);
        }, error => {
          console.log(error);
          this.toastr.error('Error al actualizar la mantención');
        });
      } else {
        // Modo creación: guarda la nueva mantención
        this._mantencionService.guardarMantencion(mantencion).subscribe(data => {
          this.toastr.success('Mantención registrada', 'La mantención fue registrada con éxito');
          this.router.navigate(['/listar-mantencion']);
        }, error => {
          console.log(error);
          this.toastr.error('Error al registrar la mantención');
        });
      }
    }
  }
  

  esEditar() {
    if (this.id) {
      this.titulo = 'Editar Mantención';
      this._mantencionService.obtenerMantencion(this.id).subscribe(data => {
        const fechaRealizacionFormatted = data.fechaRealizacion ? new Date(data.fechaRealizacion).toISOString().split('T')[0] : '';
        this.mantencionForm.patchValue({
          ...data,
          fechaRealizacion: fechaRealizacionFormatted,
        });
      });
    }
  }
}