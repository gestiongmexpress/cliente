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
    this.cargarAsistencias();
    this.cargarTrabajadores();
  
    this.filtroForm.valueChanges.subscribe(valores => {
      const { fecha, trabajador } = valores;
  
      if (fecha) {
        const [year, month] = fecha.split('-').map((part: string) => parseInt(part, 10));
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        this.filtrarPorMes(startDate, endDate);
      } else {
        this.asistenciasFiltradas = [...this.asistencias];
      }
  
      if (trabajador) {
        this.filtrarPorTrabajador(trabajador);
      }
    });
  }

  filtrarAsistencias(filtros: any): void {
    let asistenciasTemp = [...this.asistencias];
    if (filtros.trabajador) {
      asistenciasTemp = asistenciasTemp.filter(a =>
        this.esObjetoTrabajador(a.trabajador) && a.trabajador.nombre === filtros.trabajador
      );
    } else {
      asistenciasTemp = [...this.asistencias];
    }
    this.asistenciasFiltradas = asistenciasTemp;
  }
  
  esObjetoTrabajador(trabajador: any): trabajador is Trabajador {
    return typeof trabajador === 'object' && trabajador !== null && '_id' in trabajador;
  }

  calcularDiferencia(asistencia: Asistencia): number {
    return 0;
  }

  filtrarPorMes(startDate: Date, endDate: Date): void {
    this.asistenciasFiltradas = this.asistencias.filter(asistencia => {
      const asistenciaDate = new Date(asistencia.dia);
      return asistenciaDate >= startDate && asistenciaDate <= endDate;
    });
  }

  filtrarPorTrabajador(nombreTrabajador: string): void {
    this.asistenciasFiltradas = this.asistenciasFiltradas.filter(asistencia =>
      this.esObjetoTrabajador(asistencia.trabajador) && asistencia.trabajador.nombre === nombreTrabajador
    );
  }  

  cargarAsistencias(): void {
    this.asistenciaService.getAsistencias().subscribe(
      (asistencias: Asistencia[]) => {
        this.asistencias = asistencias.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
        this.asistenciasFiltradas = [...this.asistencias];
      },
      (error: any) => {
        console.error('Error al cargar asistencias', error);
      }
    );
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
}