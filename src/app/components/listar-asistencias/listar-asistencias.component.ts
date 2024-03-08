import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { Asistencia } from '../../models/asistencia';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  public diasConHorasExtrasDiurnas: { _id: string, dia: string, horas: string }[] = [];
  public diasConHorasExtrasTardias: { _id: string, dia: string, horas: string }[] = [];
  public diasConPermisoDiurno: { _id: string, dia: string, horas: string }[] = [];
  public diasConPermisoTardio: { _id: string, dia: string, horas: string }[] = [];

  constructor(
    private asistenciaService: AsistenciaService,
    private trabajadorService: TrabajadorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dateFormatService: DateFormatService,
    private toastr: ToastrService
  ) {
    this.filtroForm = this.fb.group({
      trabajador: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTrabajadores();
    this.generarOpcionesDeHoras();
    this.route.queryParams.subscribe(params => {
      if (params['trabajador'] && params['fecha']) {
        this.filtroForm.setValue({
          trabajador: params['trabajador'],
          fecha: params['fecha']
        });
        this.aplicarFiltros(params['fecha'], params['trabajador']);
      }
    });
    this.filtroForm.valueChanges.subscribe(valores => {
      if (valores.fecha && valores.trabajador) {
        this.aplicarFiltros(valores.fecha, valores.trabajador);
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
        
        this.diasConHorasExtrasDiurnas = this.asistenciasFiltradas
          .filter(asistencia => asistencia.extraDiurno)
          .map(asistencia => ({
            _id: asistencia._id!,
            dia: this.dateFormatService.formatDate(asistencia.dia),
            horas: asistencia.horasExtraDiurno || '00:00'
          }));

        this.diasConHorasExtrasTardias = this.asistenciasFiltradas
          .filter(asistencia => asistencia.extraTardio)
          .map(asistencia => ({
            _id: asistencia._id!,
            dia: this.dateFormatService.formatDate(asistencia.dia),
            horas: asistencia.horasExtraTardio || '00:00'
          }));
        
        this.diasConPermisoDiurno = this.asistenciasFiltradas
          .filter(asistencia => asistencia.permisoDiurno)
          .map(asistencia => ({
            _id: asistencia._id!,
            dia: this.dateFormatService.formatDate(asistencia.dia),
            horas: asistencia.horasPermisoDiurno || '00:00'
          }));

        this.diasConPermisoTardio = this.asistenciasFiltradas
          .filter(asistencia => asistencia.permisoTardio)
          .map(asistencia => ({
            _id: asistencia._id!,
            dia: this.dateFormatService.formatDate(asistencia.dia),
            horas: asistencia.horasPermisoTardio || '00:00'
          }));
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
    this.contarDiasConRetraso(this.asistenciasFiltradas, 5);
  }  

  cambiarHorarioSalida(asistenciaId: string, nuevoHorarioSalida: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (asistencia) {
      asistencia.horaSalida = nuevoHorarioSalida;
      const diferencia = this.calcularDiferencia(asistencia);
      asistencia.horasTotales = this.calcularTotalHoras(asistencia);
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
      asistencia.horasTotales = this.calcularTotalHoras(asistencia);
  
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
      const entradaRealMinutos = this.convertirHoraAMinutos(asistencia.entradaReal || asistencia.horaEntrada);
      const salidaRealMinutos = this.convertirHoraAMinutos(asistencia.salidaReal);
      
      let totalMinutos = salidaRealMinutos - entradaMinutos - 90;
      const diferenciaEntrada = entradaRealMinutos - entradaMinutos;
      if (diferenciaEntrada > 0) {
        totalMinutos -= diferenciaEntrada;
      }
      
      totalMinutos = Math.max(totalMinutos, 0);
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }
    return "00:00";
  }  
  
  calcularTotales(): void {
    this.totalDiferenciaMes = 0;
    let totalMinutosMes = 0;
    this.asistenciasFiltradas.forEach(asistencia => {
      asistencia.diferencia = this.calcularDiferencia(asistencia);
      asistencia.horasTotales = this.calcularTotalHoras(asistencia);
      this.totalDiferenciaMes += asistencia.diferencia || 0;
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

  horasExtras(asistenciaId: string): void {
    this.router.navigate(['/horas-extras', asistenciaId], { 
      queryParams: {
        trabajador: this.filtroForm.value.trabajador,
        fecha: this.filtroForm.value.fecha
      } 
    });
  }
  
  permisos(asistenciaId: string): void {
    this.router.navigate(['/permisos', asistenciaId], { 
      queryParams: {
        trabajador: this.filtroForm.value.trabajador,
        fecha: this.filtroForm.value.fecha
      } 
    });
  }  

  minutosAHoras(minutos: number): string {
    const signo = minutos < 0 ? "-" : "";
    const minutosAbs = Math.abs(minutos);
    const hrs = Math.floor(minutosAbs / 60);
    const mins = minutosAbs % 60;
    return `${signo}${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}


  eliminarHoraExtra(tipo: 'diurno' | 'tardio', asistenciaId: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (!asistencia) return;
    const minutosExtra = tipo === 'diurno'
      ? this.convertirHoraAMinutos(asistencia.horasExtraDiurno!)
      : this.convertirHoraAMinutos(asistencia.horasExtraTardio!);
  
    const horarioActual = tipo === 'diurno'
      ? this.convertirHoraAMinutos(asistencia.horaEntrada!)
      : this.convertirHoraAMinutos(asistencia.horaSalida!);
  
    const horarioOriginal = tipo === 'diurno'
      ? horarioActual + minutosExtra
      : horarioActual - minutosExtra;
  
    const actualizacion: Partial<Asistencia> = {
      [tipo === 'diurno' ? 'horaEntrada' : 'horaSalida']: this.minutosAHoras(horarioOriginal),
      [tipo === 'diurno' ? 'extraDiurno' : 'extraTardio']: false,
      [tipo === 'diurno' ? 'horasExtraDiurno' : 'horasExtraTardio']: null
    };
    this.asistenciaService.editarAsistencia(asistencia._id!, actualizacion).subscribe({
      next: () => {
        this.toastr.success('Hora extra eliminada con éxito');
        if (tipo === 'diurno') {
          this.diasConHorasExtrasDiurnas = this.diasConHorasExtrasDiurnas.filter(diaExtra => diaExtra._id !== asistenciaId);
        } else {
          this.diasConHorasExtrasTardias = this.diasConHorasExtrasTardias.filter(diaExtra => diaExtra._id !== asistenciaId);
        }
        const index = this.asistenciasFiltradas.findIndex(a => a._id === asistenciaId);
        if (index !== -1) {
          this.asistenciasFiltradas[index] = {
            ...this.asistenciasFiltradas[index],
            ...actualizacion
          };
        }
        this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
      },
      error: (error) => {
        this.toastr.error('Error al eliminar la hora extra');
        console.error(error);
      }
    });
  }

  eliminarPermiso(tipo: 'diurno' | 'tardio', asistenciaId: string): void {
    const asistencia = this.asistenciasFiltradas.find(a => a._id === asistenciaId);
    if (!asistencia) return;
    const minutosPermiso = tipo === 'diurno' ?
      asistencia.horasPermisoDiurno ?
        this.convertirHoraAMinutos(asistencia.horasPermisoDiurno) : 0 :
      asistencia.horasPermisoTardio ?
        this.convertirHoraAMinutos(asistencia.horasPermisoTardio) : 0;
  
    const horarioActual = tipo === 'diurno' ?
      this.convertirHoraAMinutos(asistencia.horaEntrada || '00:00') :
      this.convertirHoraAMinutos(asistencia.horaSalida || '00:00');
  
    const horarioOriginal = tipo === 'diurno' ?
      horarioActual - minutosPermiso :
      horarioActual + minutosPermiso;
  
    const actualizacion: Partial<Asistencia> = {
      [tipo === 'diurno' ? 'horaEntrada' : 'horaSalida']: this.minutosAHoras(horarioOriginal),
      [tipo === 'diurno' ? 'permisoDiurno' : 'permisoTardio']: false,
      [tipo === 'diurno' ? 'horasPermisoDiurno' : 'horasPermisoTardio']: null
    };
  
    this.asistenciaService.editarAsistencia(asistencia._id!, actualizacion).subscribe({
      next: () => {
        this.toastr.success('Permiso eliminado con éxito');
        if (tipo === 'diurno') {
          this.diasConPermisoDiurno = this.diasConPermisoDiurno.filter(permiso => permiso._id !== asistenciaId);
        } else {
          this.diasConPermisoTardio = this.diasConPermisoTardio.filter(permiso => permiso._id !== asistenciaId);
        }
        const index = this.asistenciasFiltradas.findIndex(a => a._id === asistenciaId);
        if (index !== -1) {
          this.asistenciasFiltradas[index] = {
            ...this.asistenciasFiltradas[index],
            ...actualizacion
          };
        }
        this.aplicarFiltros(this.filtroForm.value.fecha, this.filtroForm.value.trabajador);
      },
      error: (error) => {
        this.toastr.error('Error al eliminar el permiso');
        console.error(error);
      }
    });
  }

  exportarTablaAExcel(): void {
    if (this.trabajadores.length === 0) {
      this.toastr.error('La lista de trabajadores aún no está cargada');
      return;
    }
    let nombreTrabajador = 'Desconocido';
    let fechaReferencia = 'Fecha';
    if (this.asistenciasFiltradas.length > 0) {
      const asistencia = this.asistenciasFiltradas[0];
      if (typeof asistencia.trabajador === 'string') {
        const trabajadorEncontrado = this.trabajadores.find(trab => trab._id === asistencia.trabajador);
        nombreTrabajador = trabajadorEncontrado ? trabajadorEncontrado.nombre : 'Desconocido';
      } else if (asistencia.trabajador && typeof asistencia.trabajador === 'object' && 'nombre' in asistencia.trabajador) {
        nombreTrabajador = asistencia.trabajador.nombre;
      }
      fechaReferencia = this.dateFormatService.formatDate(asistencia.dia);
    }
    const datosParaExportar = this.asistenciasFiltradas.map(asistencia => {
      const horasExtrasEntrada = asistencia.extraDiurno ? asistencia.horasExtraDiurno : '';
      const horasExtrasSalida = asistencia.extraTardio ? asistencia.horasExtraTardio : '';
      const permisoEntrada = asistencia.permisoDiurno ? asistencia.horasPermisoDiurno : '';
      const permisoSalida = asistencia.permisoTardio ? asistencia.horasPermisoTardio : '';
      return {
        Trabajador: nombreTrabajador,
        Fecha: this.dateFormatService.formatDate(asistencia.dia),
        'Hora de entrada': asistencia.horaEntrada,
        'Hora de salida': asistencia.horaSalida,
        'Entrada real': asistencia.entradaReal,
        'Salida real': asistencia.salidaReal,
        'Diferencia': this.minutosAHoras(asistencia.diferencia!),
        'Total horas': asistencia.horasTotales,
        'Horas extras entrada': horasExtrasEntrada,
        'Horas extras salida': horasExtrasSalida,
        'Permiso de entrada': permisoEntrada,
        'Permiso de salida': permisoSalida
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar, {
      header: [
        'Trabajador',
        'Fecha',
        'Hora de entrada',
        'Hora de salida',
        'Entrada real',
        'Salida real',
        'Diferencia',
        'Total horas',
        'Horas extras entrada',
        'Horas extras salida',
        'Permiso de entrada',
        'Permiso de salida'
      ],
      skipHeader: false
    });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });
    const nombreArchivo = `asistencia_${nombreTrabajador.replace(/\s+/g, '_')}-${fechaReferencia}.xlsx`;
    saveAs(blob, nombreArchivo);
  }  
}