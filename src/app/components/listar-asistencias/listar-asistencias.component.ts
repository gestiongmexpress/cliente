import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { Asistencia } from '../../models/asistencia';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';

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
    public dateFormatService: DateFormatService
  ) {
    this.filtroForm = this.fb.group({
      trabajador: [''],
      fecha: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();

    this.filtroForm.valueChanges.subscribe(valores => {
      this.asistenciasFiltradas = []; // Asegurar que la tabla comienza vacía hasta que se apliquen los filtros.
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
}
