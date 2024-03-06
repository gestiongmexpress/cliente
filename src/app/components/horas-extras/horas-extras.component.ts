import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/asistencia';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.css']
})
export class HorasExtrasComponent implements OnInit {
  horasExtrasForm!: FormGroup;
  horasOpciones: string[] = [];
  trabajadorId: string | null = null;
  fecha: string | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private asistenciaService: AsistenciaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.horasExtrasForm = this.fb.group({
      asistenciaId: [''],
      horasExtras: ['', Validators.required],
      esPrevio: [false]
    });
    this.route.params.subscribe(params => {
      const asistenciaId = params['id'];
      if (asistenciaId) {
        this.horasExtrasForm.patchValue({ asistenciaId });
      }
    });
    this.route.queryParams.subscribe(params => {
      this.trabajadorId = params['trabajador'];
      this.fecha = params['fecha'];
    });
    this.generarOpcionesDeHoras();
  }

  onSubmit(): void {
    if (this.horasExtrasForm.valid) {
      const { asistenciaId, horasExtras, esPrevio } = this.horasExtrasForm.value;
      this.asistenciaService.obtenerAsistencia(asistenciaId).subscribe({
        next: (asistencia) => {
          const actualizacion = this.calcularNuevosHorarios(asistencia, horasExtras, esPrevio);
          this.asistenciaService.editarAsistencia(asistenciaId, actualizacion).subscribe({
            next: () => {
              this.toastr.success('Horario ajustado con éxito');
              this.router.navigate(['/listar-asistencias'], { queryParams: { trabajador: this.trabajadorId, fecha: this.fecha } });
            },
            error: (error) => {
              this.toastr.error('Error al ajustar el horario');
              console.error(error);
            }
          });
        },
        error: (error) => {
          this.toastr.error('Error al obtener la asistencia');
          console.error(error);
        }
      });
    }
  }  

  calcularNuevosHorarios(asistencia: Asistencia, horasExtras: string, esDiurno: boolean): Partial<Asistencia> {
    const [horas, minutos] = horasExtras.split(':').map(Number);
    const minutosExtras = horas * 60 + minutos;
  
    if (esDiurno) {
      const entradaActualMinutos = this.convertirHoraAMinutos(asistencia.horaEntrada!);
      const nuevaEntradaMinutos = entradaActualMinutos - minutosExtras;
      return { 
        horaEntrada: this.minutosAHoras(nuevaEntradaMinutos),
        extraDiurno: true,
        horasExtraDiurno: horasExtras
      };
    } else {
      const salidaActualMinutos = this.convertirHoraAMinutos(asistencia.horaSalida!);
      const nuevaSalidaMinutos = salidaActualMinutos + minutosExtras;
      return { 
        horaSalida: this.minutosAHoras(nuevaSalidaMinutos),
        extraTardio: true,
        horasExtraTardio: horasExtras
      };
    }
  }

  convertirHoraAMinutos(hora: string): number {
    const [hrs, mins] = hora.split(':').map(Number);
    return hrs * 60 + mins;
  }

  minutosAHoras(minutos: number): string {
    const hrs = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
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
}