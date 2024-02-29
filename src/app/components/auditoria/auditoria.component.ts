import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadoresFiltrados: Trabajador[] = [];
  filtroForm: FormGroup;
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);
  constructor(private trabajadorService: TrabajadorService, private fb: FormBuilder, public dateFormatService: DateFormatService) {
    this.filtroForm = this.fb.group({
      sucursal: [''],
      area: [''],
      estadoEmpresa: [''],
      plazoContrato: ['']
    });
  }

  ngOnInit(): void {
    this.trabajadorService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = data; 
      this.aplicarFiltros(); 
    });

    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const valoresFiltro = this.filtroForm.value;
    this.trabajadoresFiltrados = this.trabajadores.filter(trabajador => {
      return (
        (valoresFiltro.sucursal ? trabajador.sucursal === valoresFiltro.sucursal : true) &&
        (valoresFiltro.area ? trabajador.area === valoresFiltro.area : true) &&
        (valoresFiltro.estadoEmpresa ? trabajador.estadoEmpresa === valoresFiltro.estadoEmpresa : true) &&
        (valoresFiltro.plazoContrato ? trabajador.plazoContrato === valoresFiltro.plazoContrato : true)
      );
    });
  }

  abrirEnlace(enlace: string | undefined): void {
    if(enlace) {
      window.open(enlace, '_blank');
    }
  }
}