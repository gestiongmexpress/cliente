import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-listar-trabajadores',
  templateUrl: './listar-trabajadores.component.html',
  styleUrls: ['./listar-trabajadores.component.css']
})

export class ListarTrabajadoresComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadoresFiltrados: Trabajador[] = [];
  filtroForm: FormGroup;
  detallesExpandidos: boolean = false;
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private trabajadorService: TrabajadorService, private fb: FormBuilder, private router: Router, public dateFormatService: DateFormatService) {
    this.filtroForm = this.fb.group({
      sucursal: [''],
      area: [''],
      estadoEmpresa: [''],
      plazoContrato: ['']
    });
  }

  ngOnInit(): void {
    const formattedDate = this.dateFormatService.formatDate(new Date());
    this.trabajadorService.getTrabajadores().subscribe(data => {
      this.trabajadores = data;
      this.trabajadoresFiltrados = data;
    });

    this.filtroForm.valueChanges.subscribe(valoresFiltro => {
      this.filtrarTrabajadores(valoresFiltro);
    });
  }

  filtrarTrabajadores(filtros: any): void {
    let trabajadoresTemp = this.trabajadores;
    if (filtros.sucursal) {
      trabajadoresTemp = trabajadoresTemp.filter(t => t.sucursal === filtros.sucursal);
    }
    if (filtros.area) {
      trabajadoresTemp = trabajadoresTemp.filter(t => t.area === filtros.area);
    }
    if (filtros.estadoEmpresa) {
      trabajadoresTemp = trabajadoresTemp.filter(t => t.estadoEmpresa === filtros.estadoEmpresa);
    }
    if (filtros.plazoContrato){
      trabajadoresTemp = trabajadoresTemp.filter(t => t.plazoContrato === filtros.plazoContrato);
    }
    this.trabajadoresFiltrados = trabajadoresTemp;
  }

  verDetalles(id: string): void {
    this.router.navigate(['/detalle-trabajador', id]); 
  }

  editarTrabajador(id: string): void {
    this.router.navigate(['/editar-trabajador', id]); 
  }

  auditoriaDocumentacion(id: string) {
    this.router.navigate(['/editar-documentacion', id]);
  }
}