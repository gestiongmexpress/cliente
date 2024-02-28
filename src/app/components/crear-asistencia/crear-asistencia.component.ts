import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador';

@Component({
  selector: 'app-crear-asistencia',
  templateUrl: './crear-asistencia.component.html',
  styleUrls: ['./crear-asistencia.component.css']
})
export class CrearAsistenciaComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private asistenciaService: AsistenciaService,
    private trabajadorService: TrabajadorService
  ) {
    this.form = this.fb.group({
      trabajadorId: [''],
      mes: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.trabajadorService.getTrabajadores().subscribe(
      trabajadores => {
        this.trabajadores = trabajadores;
      },
      error => {
        console.error('Error al cargar trabajadores', error);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        trabajadorId: this.form.value.trabajadorId, 
        mes: this.form.value.mes
      };
  
      this.asistenciaService.crearAsistenciasMasivas(payload).subscribe(
        response => {
        },
        error => {
          console.error('Error al crear asistencias masivas', error);
        }
      );
    }
  }
}