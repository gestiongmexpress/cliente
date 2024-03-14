import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';
import * as XLSX from 'xlsx';

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
  
  exportarAExcel(): void {
    const datosParaExcel = this.trabajadoresFiltrados.map(trabajador => ({
      Nombre: trabajador.nombre,
      Rut: trabajador.rut,
      'Fecha Nacimiento': trabajador.fechaNacimiento ? new Date(trabajador.fechaNacimiento).toLocaleDateString() : '',
      Celular: trabajador.celular ?? '',
      'Estado Civil': trabajador.estadoCivil ?? '',
      Domicilio: trabajador.domicilio ?? '',
      Sector: trabajador.sector ?? '',
      Ciudad: trabajador.ciudad ?? '',
      'Empresa que contrata': trabajador.empresaContrata ?? '',
      'Tipo Contrato': trabajador.tipoContrato ?? '',
      'Plazo del contrato': trabajador.plazoContrato ?? '',
      'Fecha Inicio Contrato': trabajador.fechaInicioContrato ? new Date(trabajador.fechaInicioContrato).toLocaleDateString() : '',
      'Fecha Termino Contrato': trabajador.fechaTerminoContrato ? new Date(trabajador.fechaTerminoContrato).toLocaleDateString() : '',
      Cargo: trabajador.cargo ?? '',
      Área: trabajador.area ?? '',
      Sucursal: trabajador.sucursal ?? '',
      'Dirección del proyecto': trabajador.direccionProyecto ?? '',
      'Numero de contrato': trabajador.numeroContrato ?? '',
      'Licencia de conducir': trabajador.licenciaConducir ?? '',
      'Clase de licencia': trabajador.claseLicencia ?? '',
      Nacionalidad: trabajador.nacionalidad ?? '',
      Banco: trabajador.banco ?? '',
      'Tipo de cuenta': trabajador.tipoCuenta ?? '',
      'Numero de cuenta': trabajador.numeroCuenta ?? '',
      'Correo electrónico': trabajador.correoElectronico ?? '',
      Calzado: trabajador.calzado ?? '',
      'Talla Camisa': trabajador.tallaCamisa ?? '',
      'Talla Pantalón': trabajador.tallaPantalon ?? '',
      AFP: trabajador.afp ?? '',
      'Fecha Incorporación AFP': trabajador.fechaIncorporacionAFP ? new Date(trabajador.fechaIncorporacionAFP).toLocaleDateString() : '',
      'Institución de Salud': trabajador.institucionSalud ?? '',
      'Entrega de Ropa': trabajador.entregaRopaTrabajo ?? '',
      'Estado de Empresa': trabajador.estadoEmpresa,
      'Fecha de Finiquito': trabajador.fechaFiniquito ? new Date(trabajador.fechaFiniquito).toLocaleDateString() : '',
      'Causa de Finiquito': trabajador.causaFiniquito ?? '',
      'Fecha de No Vigencia': trabajador.fechaNoVigencia ? new Date(trabajador.fechaNoVigencia).toLocaleDateString() : '',
      'Causa de no vigencia': trabajador.razonNoVigencia ?? '',
      'Escala de recomendación': trabajador.escalaRecomendacion ?? '',
      'Sueldo Base': trabajador.sueldoBase ?? '',
      'Fecha de Actualización de Oferta': trabajador.fechaActualizacionOferta ? new Date(trabajador.fechaActualizacionOferta).toLocaleDateString() : '',
      'Días de vacaciones': trabajador.diasVacaciones ?? ''
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trabajadores');
    XLSX.writeFile(wb, 'ListaTrabajadores.xlsx');
  }
}