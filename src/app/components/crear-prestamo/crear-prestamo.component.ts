import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrestamoService } from '../../services/prestamo.service'; 
import { Prestamo } from '../../models/prestamo'; 
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Trabajador } from '../../models/trabajador';

@Component({
  selector: 'app-crear-prestamo',
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.css']
})
export class CrearPrestamoComponent implements OnInit {
  prestamoForm: FormGroup;
  titulo = 'Crear Préstamo';
  id: string | null;
  trabajadores: Trabajador[] = []; 
  cuotaMensual: number | null = null;
  esQuincena: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _prestamoService: PrestamoService,
    private aRouter: ActivatedRoute,
    private _trabajadorService: TrabajadorService,
  ) {
    this.prestamoForm = this.fb.group({
      trabajador: ['', Validators.required], 
      monto: ['', [Validators.required, Validators.min(1)]],
      cuotas: ['1', [Validators.required, Validators.min(1)]],
      fechaInicio: ['', Validators.required] ,
      descripcion: [''],
      quincena: ['']
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  esModoEdicion = false;

  ngOnInit(): void {
    this.esEditar();
    this.cargarTrabajadores();
  
    const montoControl = this.prestamoForm.get('monto');
    const cuotasControl = this.prestamoForm.get('cuotas');
  
    if (montoControl && cuotasControl) {
      montoControl.valueChanges.subscribe(this.calcularCuotaMensual);
      cuotasControl.valueChanges.subscribe(this.calcularCuotaMensual);
    }
  }
  
  actualizarCuotaMensual() {
    const { monto, cuotas } = this.prestamoForm.value;
    this.cuotaMensual = cuotas > 0 ? Math.ceil(monto / cuotas) : null;
  }

  agregarPrestamo() {
    if (this.prestamoForm.valid) {
      const { monto, cuotas } = this.prestamoForm.value;
      const cuotaMensual = Math.ceil(monto / cuotas);

      const prestamo: Prestamo = {
        ...this.prestamoForm.value,
        cuotaMensual, 
        estado: 'Pendiente',
        cuotaActual: 0,
        saldo: monto,
      };
  
      if (this.id) {
        // Editar préstamo
        this._prestamoService.editarPrestamo(this.id, prestamo).subscribe(data => {
          this.toastr.info('Préstamo actualizado', 'El préstamo fue actualizado con éxito');
          this.router.navigate(['/listar-prestamos']);
        }, error => {
          this.toastr.error('Error al actualizar el préstamo');
        });
      } else {
        // Crear nuevo préstamo
        this._prestamoService.guardarPrestamo(prestamo).subscribe(data => {
          this.toastr.success('Préstamo registrado', 'El préstamo fue registrado con éxito');
          this.router.navigate(['/listar-prestamos']);
        }, error => {
          this.toastr.error('Error al registrar el préstamo');
        });
      }
    }
  }

  calcularCuotaMensual = () => {
    const monto = this.prestamoForm.get('monto')?.value;
    const cuotas = this.prestamoForm.get('cuotas')?.value;
    if (monto && cuotas && cuotas > 0) {
      this.cuotaMensual = Math.ceil(monto / cuotas);
    } else {
      this.cuotaMensual = null;
    }
  };

  esEditar() {
    if (this.id) {
      this.titulo = 'Editar Préstamo';
      this._prestamoService.obtenerPrestamo(this.id).subscribe(data => {
        const fechaInicio = typeof data.fechaInicio === 'string' ? data.fechaInicio.split('T')[0] : data.fechaInicio.toISOString().split('T')[0];
        const trabajadorId = typeof data.trabajador === 'object' ? data.trabajador._id : data.trabajador;
        
        this.prestamoForm.patchValue({
          ...data,
          fechaInicio: fechaInicio,
          trabajador: trabajadorId,
        });
      });
    }
  }  

  cargarTrabajadores() {
    this._trabajadorService.getTrabajadores().subscribe(
      trabajadores => {
        this.trabajadores = trabajadores;
      },
      error => {
        console.error('Error al cargar los trabajadores', error);
        this.toastr.error('Error al cargar los trabajadores');
      }
    );
  }

  onQuincenaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.esQuincena = selectElement.value === 'true';
    if (this.esQuincena) {
      this.prestamoForm.patchValue({ descripcion: 'QUINCENA' });
    } else {
      this.prestamoForm.patchValue({ descripcion: '' });
    }
  }
}