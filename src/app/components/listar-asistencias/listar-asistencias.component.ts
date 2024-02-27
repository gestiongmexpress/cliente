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
    this.asistenciaService.getAsistencias().subscribe(data => {
      this.asistencias = data;
      this.asistenciasFiltradas = data;
    });

    this.trabajadorService.getTrabajadores().subscribe(data => { 
      this.trabajadores = data;
    });

    this.filtroForm.valueChanges.subscribe(valoresFiltro => {
      this.filtrarAsistencias(valoresFiltro);
    });
  }

  filtrarAsistencias(filtros: any): void {
    let asistenciasTemp = [...this.asistencias]; 
  
    if (filtros.trabajador) {
      asistenciasTemp = asistenciasTemp.filter(a => {
        if (this.esObjetoTrabajador(a.trabajador)) {
          return a.trabajador._id === filtros.trabajador;
        }
        return false;
      });
    }
    this.asistenciasFiltradas = asistenciasTemp;
  }
  
  esObjetoTrabajador(trabajador: any): trabajador is Trabajador {
    return typeof trabajador === 'object' && trabajador !== null && '_id' in trabajador;
  }

}