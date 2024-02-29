import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { Asistencia } from '../../models/asistencia';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-asistencias',
  templateUrl: './listar-asistencias.component.html',
  styleUrls: ['./listar-asistencias.component.css']
})
export class ListarAsistenciasComponent implements OnInit {
  asistencias: Asistencia[] = [];
  trabajadores: Trabajador[] = [];
  asistenciasFiltradas: Asistencia[] = [];
  filtroForm: FormGroup;

  constructor(
    private asistenciaService: AsistenciaService,
    private trabajadorService: TrabajadorService,
    private fb: FormBuilder,
    private router: Router,
    public dateFormatService: DateFormatService,
    private toastr: ToastrService
  ) {
    this.filtroForm = this.fb.group({
      trabajador: [''],
      fecha: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();

    this.filtroForm.valueChanges.subscribe(valores => {
      this.asistenciasFiltradas = [];
      const { fecha, trabajador } = valores;
      if (fecha && trabajador) {
        this.aplicarFiltros(fecha, trabajador);
      }
    });
  }

  aplicarFiltros(fecha: string, trabajador: string): void {
    const [year, month] = fecha.split('-').map(part => parseInt(part, 10));
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
  
    this.asistenciaService.getAsistencias().subscribe(
      (asistencias: Asistencia[]) => {
        let asistenciasPorFecha = asistencias.filter(asistencia => {
          const asistenciaDate = new Date(asistencia.dia);
          return asistenciaDate >= startDate && asistenciaDate <= endDate;
        }).filter(asistencia =>
          this.esObjetoTrabajador(asistencia.trabajador) && asistencia.trabajador.nombre === trabajador
        );
  
        asistenciasPorFecha.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
  
        this.asistenciasFiltradas = asistenciasPorFecha;
      },
      (error: any) => {
        console.error('Error al cargar asistencias', error);
      }
    );
  }
  

  esObjetoTrabajador(trabajador: any): trabajador is Trabajador {
    return typeof trabajador === 'object' && trabajador !== null && '_id' in trabajador;
  }

  cargarTrabajadores(): void {
    this.trabajadorService.getTrabajadores().subscribe(
      (trabajadores: Trabajador[]) => {
        this.trabajadores = trabajadores;
      },
      (error: any) => {
        console.error('Error al cargar trabajadores', error);
      }
    );
  }

  calcularDiferencia(asistencia: Asistencia): number {
    return 0;
  }

  cambiarHorarioEntrada(asistenciaId: string, nuevoHorarioEntrada: string): void {
    this.asistenciaService.editarAsistencia(asistenciaId, { horaEntrada: nuevoHorarioEntrada }).subscribe({
      next: (response) => {
        this.toastr.success('Horario de entrada actualizado correctamente');
        // Actualiza la lista de asistencias después de cambiar el horario
        this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al actualizar el horario de entrada');
      }
    });
  }

  cambiarHorarioSalida(asistenciaId: string, nuevoHorarioSalida: string): void {
    this.asistenciaService.editarAsistencia(asistenciaId, { horaSalida: nuevoHorarioSalida }).subscribe({
      next: (response) => {
        this.toastr.success('Horario de salida actualizado correctamente');
        this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al actualizar el horario de salida');
      }
    });
  }
}