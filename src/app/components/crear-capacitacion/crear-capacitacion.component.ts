import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CapacitacionService } from '../../services/capacitacion.service';
import { Capacitacion } from '../../models/capacitacion';

@Component({
  selector: 'app-crear-capacitacion',
  templateUrl: './crear-capacitacion.component.html',
  styleUrls: ['./crear-capacitacion.component.css']
})
export class CrearCapacitacionComponent implements OnInit {
  capacitacionForm: FormGroup;
  titulo = 'Crear capacitación';
  id: string | null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _capacitacionService: CapacitacionService,
    private aRouter: ActivatedRoute
  ) {
    this.capacitacionForm = this.fb.group({
      nombreCapacitacion: ['', Validators.required],
      sucursal: ['', Validators.required],
      mes: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(2023)]],
      encargado: ['', Validators.required],
      asistentes: [''], 
      nota: [''],
      diaRealizado: ['']
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  esModoEdicion = false;

  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.id;
    this.esEditar();
  }

  agregarCapacitacion() {
    if (this.capacitacionForm.valid) {
      const capacitacion: Capacitacion = this.capacitacionForm.value;
      capacitacion.estado = 'Pendiente';

      if(this.id) {
        // Modo edición: actualiza la capacitación existente
        this._capacitacionService.editarCapacitacion(this.id, capacitacion).subscribe(data => {
          this.toastr.info('Capacitación actualizada', 'La capacitación fue actualizada con éxito');
          this.router.navigate(['/listar-capacitacion'])
        }, error => {
          this.toastr.error('Error al actualizar la capacitación');
        });
      } else {
        // Modo creación: guarda la nueva capacitación
        this._capacitacionService.guardarCapacitacion(capacitacion).subscribe(data => {
          this.toastr.success('Capacitación registrada', 'La capacitación fue registrada con éxito');
          this.router.navigate(['/listar-capacitacion']);
        }, error => {
          this.toastr.error('Error al registrar la capacitación');
        });
      }
    }
  }

  esEditar() {
    if (this.id) {
      this.titulo = 'Editar capacitación';
      this._capacitacionService.obtenerCapacitacion(this.id).subscribe(data => {
        const fechaRealizacionFormatted = data.diaRealizado
          ? new Date(data.diaRealizado).toISOString().split('T')[0]
          : '';
  
        this.capacitacionForm.patchValue({
          ...data,
          diaRealizado: fechaRealizacionFormatted
        });
      });
    }
  }
}