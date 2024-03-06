import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AsistenciaService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/asistencia';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css']
})
export class PermisoComponent implements OnInit {
  permisoForm!: FormGroup;
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
    this.permisoForm = this.fb.group({
      asistenciaId: [''],
      horasPermiso: ['', Validators.required],
      esDiurno: [false]
    });
    this.route.queryParams.subscribe(params => {
      this.trabajadorId = params['trabajador'];
      this.fecha = params['fecha'];
      const asistenciaId = this.route.snapshot.params['id'];
      if (asistenciaId) {
        this.permisoForm.patchValue({ asistenciaId });
      }
    });
    this.generarOpcionesDeHoras();
  }

  onSubmit(): void {
    if (this.permisoForm.valid) {
      const { asistenciaId, horasPermiso, esDiurno } = this.permisoForm.value;
      this.asistenciaService.obtenerAsistencia(asistenciaId).subscribe({
        next: (asistencia) => {
          const actualizacion = this.calcularNuevoHorarioPermiso(asistencia, horasPermiso, esDiurno);
          this.asistenciaService.editarAsistencia(asistenciaId, actualizacion).subscribe({
            next: () => {
              this.toastr.success('Permiso registrado con éxito');
              this.router.navigate(['/listar-asistencias'], { queryParams: { trabajador: this.trabajadorId, fecha: this.fecha } });
            },
            error: (error) => {
              this.toastr.error('Error al registrar el permiso');
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

  calcularNuevoHorarioPermiso(asistencia: Asistencia, horasPermiso: string, esDiurno: boolean): Partial<Asistencia> {
    const [horas, minutos] = horasPermiso.split(':').map(Number);
    const minutosPermiso = horas * 60 + minutos;
  
    if (esDiurno) {
      const entradaActualMinutos = this.convertirHoraAMinutos(asistencia.horaEntrada || '00:00');
      const nuevaEntradaMinutos = entradaActualMinutos + minutosPermiso;
      return { 
        horaEntrada: this.minutosAHoras(nuevaEntradaMinutos),
        permisoDiurno: true,
        horasPermisoDiurno: horasPermiso
      };
    } else {
      const salidaActualMinutos = this.convertirHoraAMinutos(asistencia.horaSalida || '00:00');
      const nuevaSalidaMinutos = salidaActualMinutos - minutosPermiso;
      return { 
        horaSalida: this.minutosAHoras(nuevaSalidaMinutos),
        permisoTardio: true,
        horasPermisoTardio: horasPermiso
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

  volverAListado(): void {
    this.router.navigate(['/listar-asistencias'], { queryParams: { trabajador: this.trabajadorId, fecha: this.fecha } });
  }  
}