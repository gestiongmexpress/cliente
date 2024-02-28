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
      const { trabajadorId, mes } = this.form.value;
      this.verificarYCrearAsistencias(trabajadorId, mes);
    }
  }

  verificarYCrearAsistencias(trabajadorId: string, mes: string): void {
    const inicioMes = `${mes}-01`;
  
    this.asistenciaService.obtenerAsistenciasPorTrabajadorYMes(trabajadorId, inicioMes).subscribe(
      asistencias => {
        if (asistencias.length > 0) {
          alert('Ya existen asistencias para este trabajador en el mes seleccionado.');
        } else {
          this.crearAsistenciasMensuales(trabajadorId, mes);
        }
      },
      error => {
        console.error('Error al verificar asistencias', error);
      }
    );
  }

  crearAsistenciasMensuales(trabajadorId: string, mes: string): void {
    const payload = {
      trabajadorId: trabajadorId,
      mes: mes
    };
    this.asistenciaService.crearAsistenciasMasivas(payload).subscribe(
      response => {
        alert('Asistencias creadas con éxito.');
      },
      error => {
        console.error('Error al crear asistencias masivas', error);
        alert('Ocurrió un error al crear las asistencias.');
      }
    );
  }
};