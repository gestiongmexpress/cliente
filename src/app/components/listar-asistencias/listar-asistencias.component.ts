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
  horasOpciones: string[] = [];
  asistenciasFiltradas: Asistencia[] = [];
  totalDiferenciaMes: number = 0;
  totalHorasMes: string = '00:00';
  filtroForm: FormGroup;
  diasConRetraso: number = 0;

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
    this.generarOpcionesDeHoras();
    this.filtroForm.valueChanges.subscribe(valores => {
      this.asistenciasFiltradas = [];
      const { fecha, trabajador } = valores;
      if (fecha && trabajador) {
        this.aplicarFiltros(fecha, trabajador);
      }
    });
    this.calcularTotales();
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
        this.calcularTotales();
        this.contarDiasConRetraso(this.asistenciasFiltradas, 5);
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
    this.calcularTotales();
  }

  cambiarHorarioEntrada(asistenciaId: string, nuevoHorarioEntrada: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (asistencia) {
      asistencia.horaEntrada = nuevoHorarioEntrada;
      asistencia.diferencia = this.calcularDiferencia(asistencia);
      asistencia.horasTotales = this.calcularTotalHoras(asistencia);
  
      const actualizacion = {
        horaEntrada: nuevoHorarioEntrada,
        diferencia: asistencia.diferencia,
        horasTotales: asistencia.horasTotales
      };
  
      this.asistenciaService.editarAsistencia(asistenciaId, actualizacion).subscribe({
        next: (response) => {
          this.toastr.success('Horario de entrada actualizada correctamente');
          this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Hubo un error al actualizar el horario de entrada');
        }
      });
    }
    this.calcularTotales();
    this.contarDiasConRetraso(this.asistenciasFiltradas, 5);
  }  

  cambiarHorarioSalida(asistenciaId: string, nuevoHorarioSalida: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (asistencia) {
      asistencia.horaSalida = nuevoHorarioSalida;
      const diferencia = this.calcularDiferencia(asistencia);
      this.asistenciaService.editarAsistencia(asistenciaId, { horaSalida: nuevoHorarioSalida, diferencia }).subscribe({
        next: (response) => {
          this.toastr.success('Horario de salida actualizada correctamente');
          this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Hubo un error al actualizar el horario de salida');
        }
      });
    }
    this.calcularTotales();
  }
  
  generarOpcionesDeHoras() {
    for (let hora = 0; hora < 24; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 15) {
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        this.horasOpciones.push(`${horaStr}:${minutoStr}`);
      }
    }
  }

  cambiarHorarioEntradaReal(asistenciaId: string, nuevaEntradaReal: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (asistencia) {
      asistencia.entradaReal = nuevaEntradaReal;
      asistencia.diferencia = this.calcularDiferencia(asistencia);
  
      const actualizacion = {
        entradaReal: nuevaEntradaReal,
        diferencia: asistencia.diferencia
      };
  
      this.asistenciaService.editarAsistencia(asistenciaId, actualizacion).subscribe({
        next: (response) => {
          this.toastr.success('Hora de entrada actualizada correctamente');
          this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Hubo un error al actualizar la hora de entrada');
        }
      });
    }
    this.calcularTotales();
    this.contarDiasConRetraso(this.asistenciasFiltradas, 5);
  }
  
  cambiarHorarioSalidaReal(asistenciaId: string, nuevaSalidaReal: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (asistencia) {
      asistencia.salidaReal = nuevaSalidaReal;
      asistencia.diferencia = this.calcularDiferencia(asistencia);
      asistencia.horasTotales = this.calcularTotalHoras(asistencia);
      const actualizacion = {
        salidaReal: nuevaSalidaReal,
        diferencia: asistencia.diferencia,
        horasTotales: asistencia.horasTotales
      };
  
      this.asistenciaService.editarAsistencia(asistenciaId, actualizacion).subscribe({
        next: (response) => {
          this.toastr.success('Hora de salida actualizada correctamente');
          this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Hubo un error al actualizar la hora de salida');
        }
      });
    }
    this.calcularTotales();
  }

  convertirHoraAMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  calcularDiferencia(asistencia: Asistencia): number {
    if (asistencia.horaEntrada && asistencia.entradaReal) {
      const entradaOficial = this.convertirHoraAMinutos(asistencia.horaEntrada);
      const entradaReal = this.convertirHoraAMinutos(asistencia.entradaReal);
      const diferenciaEntrada = entradaReal > entradaOficial ? entradaReal - entradaOficial : 0;
      let diferenciaSalida = 0;
      if (asistencia.horaSalida && asistencia.salidaReal) {
        const salidaOficial = this.convertirHoraAMinutos(asistencia.horaSalida);
        const salidaReal = this.convertirHoraAMinutos(asistencia.salidaReal);
        diferenciaSalida = salidaReal - salidaOficial;
      }
      const diferenciaTotal = diferenciaSalida - diferenciaEntrada;
      return diferenciaTotal;
    }
    return 0;
  }

  calcularTotalHoras(asistencia: Asistencia): string {
    if (asistencia.horaEntrada && asistencia.salidaReal) {
      const entradaMinutos = this.convertirHoraAMinutos(asistencia.horaEntrada);
      const salidaRealMinutos = this.convertirHoraAMinutos(asistencia.salidaReal);
      let totalMinutos = salidaRealMinutos - entradaMinutos - 90;
      totalMinutos = Math.max(totalMinutos, 0);
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }
    return "00:00";
  }
  
  calcularTotales(): void {
    this.totalDiferenciaMes = this.asistenciasFiltradas.reduce((acc, asistencia) => acc + (asistencia.diferencia || 0), 0);
    let totalMinutosMes = 0;
    this.asistenciasFiltradas.forEach(asistencia => {
        const [horas, minutos] = (asistencia.horasTotales || '0:00').split(':').map(Number);
        totalMinutosMes += horas * 60 + minutos;
    });
    const horasTotales = Math.floor(totalMinutosMes / 60);
    const minutosTotales = totalMinutosMes % 60;
    this.totalHorasMes = `${horasTotales.toString().padStart(2, '0')}:${minutosTotales.toString().padStart(2, '0')}`;
  }

  contarDiasConRetraso(asistencias: Asistencia[], umbralMinutos: number): number {
    return asistencias.reduce((contador, asistencia) => {
      const minutosRetraso = this.calcularMinutosDeRetraso(asistencia);
      return minutosRetraso > umbralMinutos ? contador + 1 : contador;
    }, 0);
  }

  calcularMinutosDeRetraso(asistencia: Asistencia): number {
    if (!asistencia.horaEntrada || !asistencia.entradaReal) {
      return 0;
    }
    const entradaOficialMinutos = this.convertirHoraAMinutos(asistencia.horaEntrada);
    const entradaRealMinutos = this.convertirHoraAMinutos(asistencia.entradaReal);
    const minutosRetraso = entradaRealMinutos - entradaOficialMinutos;
    return minutosRetraso > 0 ? minutosRetraso : 0;
  }

  contarDiasTrabajados(asistencias: Asistencia[]): number {
    return asistencias.filter(asistencia => 
      asistencia.horaEntrada && asistencia.horaSalida && 
      asistencia.entradaReal && asistencia.salidaReal
    ).length;
  }  
}