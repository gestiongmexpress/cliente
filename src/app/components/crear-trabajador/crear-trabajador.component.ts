import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Trabajador } from '../../models/trabajador'; 

@Component({
  selector: 'app-crear-trabajador',
  templateUrl: './crear-trabajador.component.html',
  styleUrls: ['./crear-trabajador.component.css']
})
export class CrearTrabajadorComponent implements OnInit {
  trabajadorForm: FormGroup;
  titulo = 'Crear Trabajador';
  mostrarTipoLicencia: boolean = false;
  id: string | null;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _trabajadorService: TrabajadorService,
    private aRouter: ActivatedRoute
  ) {
    this.trabajadorForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      celular: [''],
      estadoCivil: [''],
      domicilio: [''],
      sector: [''],
      ciudad: [''],
      empresaContrata: [''],
      tipoContrato: [''],
      plazoContrato: [''],
      fechaInicioContrato: [''],
      fechaTerminoContrato: [''],
      cargo: [''],
      area: [''],
      sucursal: [''],
      direccionProyecto: [''],
      numeroContrato: [''],
      licenciaConducir: [''],
      claseLicencia: [''],
      nacionalidad: [''],
      banco: [''],
      tipoCuenta: [''],
      numeroCuenta: [''],
      correoElectronico: ['', Validators.email], 
      calzado: [''],
      tallaCamisa: [''],
      tallaPantalon: [''],
      afp: [''],
      fechaIncorporacionAFP: [''],
      institucionSalud: [''],
      entregaRopaTrabajo: [''],
      contactoEmergencia: this.fb.group({ 
        nombre: [''],
        parentesco: [''],
        telefono: ['', Validators.pattern(/^\d+$/)]
      }),
      estadoEmpresa: ['', Validators.required],
      fechaFiniquito: [''],
      causaFiniquito: [''],
      escalaRecomendacion: ['', [Validators.min(1), Validators.max(10)]],
      sueldoBase: [''],
      fechaActualizacionOferta: [''],
      diasVacaciones: ['']
    });
    
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  esModoEdicion = false;

  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.id;
    if (this.esModoEdicion) {
      this.esEditar();
    }
  }

  agregarTrabajador() {
    if (this.trabajadorForm.valid) {
      const trabajador: Trabajador = this.trabajadorForm.value;
  
      if (this.id) {
        // Modo edición: actualiza el trabajador existente
        this._trabajadorService.editarTrabajador(this.id, trabajador).subscribe(data => {
          this.toastr.info('Trabajador actualizado', 'El trabajador fue actualizado con éxito');
          this.router.navigate(['/listar-trabajadores']); 
        }, error => {
          console.log(error);
          this.toastr.error('Error al actualizar el trabajador');
        });
      } else {
        // Modo creación: guarda el nuevo trabajador
        this._trabajadorService.guardarTrabajador(trabajador).subscribe(data => {
          this.toastr.success('Trabajador registrado', 'El trabajador fue registrado con éxito');
          this.router.navigate(['/listar-trabajadores']); 
        }, error => {
          console.log(error);
          this.toastr.error('Error al registrar el trabajador');
        });
      }
    }
  }

  esEditar() {
    if (this.id) {
      this.titulo = 'Editar Trabajador';
      this._trabajadorService.obtenerTrabajador(this.id).subscribe(data => {
        const fechaNacimientoFormatted = data.fechaNacimiento ? new Date(data.fechaNacimiento).toISOString().split('T')[0] : '';
  
        this.trabajadorForm.patchValue({
          ...data,
          fechaNacimiento: fechaNacimientoFormatted, 
        });
      });
    }
  }  

  

  onChangeLicencia(event: any) {
    this.mostrarTipoLicencia = event.target.value === 'Sí';
  }  
}
