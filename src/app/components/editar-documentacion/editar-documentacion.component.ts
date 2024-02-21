import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrabajadorService } from '../../services/trabajador.service';

@Component({
  selector: 'app-editar-documentacion',
  templateUrl: './editar-documentacion.component.html',
  styleUrls: ['./editar-documentacion.component.css']
})
export class EditarDocumentacionComponent implements OnInit {
  documentacionForm: FormGroup;
  id: string | null;
  nombreTrabajador: string; 
  rutTrabajador: string; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private trabajadorService: TrabajadorService,
    private aRouter: ActivatedRoute
  ) {
    this.documentacionForm = this.fb.group({
      focotopiaCedula: [''],
      certificadoAntecedentes: [''],
      certificadoAFP: [''],
      certificadoSalud: [''],
      induccion: [''],
      perfilDeCargo: [''],
      obligacionInformacion: [''],
      recepcionReglamento: [''],
      examenRiohs: [''],
      certificadoAprobacionHigiene: [''],
      recepcionCovid: [''],
      cartaOferta: [''],
      registroRopa: [''],
      contratoFirmado: [''],
      anexoContrato: [''],
      estadoDocumentacion: ['']
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.nombreTrabajador = ''; 
    this.rutTrabajador = ''; 
  }

  ngOnInit(): void {
    if (this.id) {
      this.cargarDatosTrabajador(this.id);
    }
    this.documentacionForm.valueChanges.subscribe(() => {
      this.verificarEstadoDocumentacion();
    });
  }

  cargarDatosTrabajador(id: string) {
    this.trabajadorService.obtenerTrabajador(id).subscribe(data => {
      this.documentacionForm.patchValue({
        focotopiaCedula: data.focotopiaCedula,
        certificadoAntecedentes: data.certificadoAntecedentes,
        certificadoAFP: data.certificadoAFP,
        certificadoSalud: data.certificadoSalud,
        induccion: data.induccion,
        perfilDeCargo: data.perfilDeCargo,
        obligacionInformacion: data.obligacionInformacion,
        recepcionReglamento: data.recepcionReglamento,
        examenRiohs: data.examenRiohs,
        certificadoAprobacionHigiene: data.certificadoAprobacionHigiene,
        recepcionCovid: data.recepcionCovid,
        cartaOferta: data.cartaOferta,
        registroRopa: data.registroRopa,
        contratoFirmado: data.contratoFirmado,
        anexoContrato: data.anexoContrato,
        estadoDocumentacion: data.estadoDocumentacion
      });
  
      this.nombreTrabajador = data.nombre;
      this.rutTrabajador = data.rut;
    });
  }
  

  actualizarDocumentacion() {
    if (this.documentacionForm.valid && this.id) {
      this.trabajadorService.editarTrabajador(this.id, this.documentacionForm.value).subscribe(
        data => {
          this.toastr.success('Documentación actualizada correctamente', 'Actualización exitosa');
          this.router.navigate(['/listar-trabajadores']);
        },
        error => {
          console.error(error);
          this.toastr.error('Error al actualizar la documentación', 'Error');
        }
      );
    }
  }

  verificarEstadoDocumentacion() {
    const formValues = this.documentacionForm.value;
    const propiedadesRequeridas = [
      'focotopiaCedula',
      'certificadoAntecedentes',
      'certificadoAFP',
      'certificadoSalud',
      'perfilDeCargo',
      'obligacionInformacion',
      'recepcionReglamento',
      'examenRiohs',
      'certificadoAprobacionHigiene',
      'cartaOferta',
      'anexoContrato'
    ];
  
    const propiedadesCompletas = propiedadesRequeridas.every(prop => formValues[prop]);
  
    const condicionesEspecificasCompletas = 
      formValues.induccion === 'Realizada' &&
      formValues.registroRopa === 'Realizado' &&
      formValues.contratoFirmado === 'Realizado';
  
    const nuevoEstado = propiedadesCompletas && condicionesEspecificasCompletas ? 'OK' : 'Pendiente';
  
    const estadoDocumentacionControl = this.documentacionForm.get('estadoDocumentacion');
    if (estadoDocumentacionControl) {
      estadoDocumentacionControl.setValue(nuevoEstado, { emitEvent: false });
    }
  }
  
}