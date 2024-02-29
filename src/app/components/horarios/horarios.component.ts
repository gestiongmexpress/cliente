import { Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Trabajador } from '../../models/trabajador'; 
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})

export class HorariosComponent implements OnInit {
  trabajadores: Trabajador[] = []; 
  trabajadoresFiltrados: Trabajador[] = [];
  filtroForm: FormGroup;

  constructor(private trabajadorService: TrabajadorService,  private toastr: ToastrService, private fb: FormBuilder) {
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
      this.trabajadoresFiltrados = [...this.trabajadores]; 
    });

    this.filtroForm.valueChanges.subscribe(valoresFiltro => {
      this.filtrarTrabajadores(valoresFiltro);
    });
  }

  filtrarTrabajadores(filtros: any): void {
    this.trabajadoresFiltrados = this.trabajadores.filter(t => {
      return (!filtros.sucursal || t.sucursal === filtros.sucursal) &&
             (!filtros.area || t.area === filtros.area) &&
             (!filtros.estadoEmpresa || t.estadoEmpresa === filtros.estadoEmpresa) &&
             (!filtros.plazoContrato || t.plazoContrato === filtros.plazoContrato);
    });
  }

  cambiarHorarioEntrada(trabajadorId: string, nuevoHorarioEntrada: string): void {
    const trabajadorActualizado = { horarioEntrada: nuevoHorarioEntrada };
  
    this.trabajadorService.editarTrabajador(trabajadorId, trabajadorActualizado).subscribe({
      next: (response) => {
        this.toastr.success('Horario de entrada actualizado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al actualizar el horario de entrada');
      }
    });
  }
  
  cambiarHorarioSalida(trabajadorId: string, nuevoHorarioSalida: string): void {
    const trabajadorActualizado = { horarioSalida: nuevoHorarioSalida };

    this.trabajadorService.editarTrabajador(trabajadorId, trabajadorActualizado).subscribe({
      next: (response) => {
        this.toastr.success('Horario de salida actualizado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al actualizar el horario de salida');
      }
    });
  }
}