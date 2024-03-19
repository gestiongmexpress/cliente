import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrestamoService } from '../../services/prestamo.service';
import { Prestamo } from '../../models/prestamo';

@Component({
  selector: 'app-abonar-prestamo',
  templateUrl: './abonar-prestamo.component.html',
  styleUrls: ['./abonar-prestamo.component.css']
})
export class AbonarPrestamoComponent implements OnInit {
  abonoForm: FormGroup;
  prestamo: Prestamo | undefined;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private prestamoService: PrestamoService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.abonoForm = this.fb.group({
      abono: ['', [Validators.required, Validators.min(1)]],
    });
    const routeId = this.aRouter.snapshot.paramMap.get('id');
    if (routeId === null) {
      this.toastr.error('No se proporcionó ID de préstamo');
      this.router.navigate(['/listar-prestamos']);
    } else {
      this.id = routeId;
    }
  }

  ngOnInit(): void {
    if (this.id) {
      this.cargarPrestamo();
    }
  }

  cargarPrestamo(): void {
    this.prestamoService.obtenerPrestamo(this.id).subscribe(data => {
      this.prestamo = data;
      this.actualizarValidacionesAbono();
    }, error => {
      this.toastr.error('Error al cargar el préstamo');
      console.error(error);
    });
  }

  actualizarValidacionesAbono(): void {
    const abonoControl = this.abonoForm.get('abono');
    if (abonoControl && this.prestamo) {
      abonoControl.setValidators([
        Validators.required,
        Validators.min(1),
        this.validarMontoMaximo(this.prestamo.saldo)
      ]);
      abonoControl.updateValueAndValidity();
    }
  }

  validarMontoMaximo(saldo: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const esInvalido = control.value !== null && saldo !== null && control.value > saldo;
      return esInvalido ? { 'montoMaximo': true } : null;
    };
  }

  abonar(): void {
    if (this.abonoForm.valid && this.prestamo) {
      const abono = this.abonoForm.get('abono')!.value;
      if (abono <= this.prestamo.saldo) {
        this.prestamo.saldo -= abono;
        const nuevoMontoCuota = this.prestamo.cuotas > 0 ? this.prestamo.saldo / this.prestamo.cuotas : 0;
        this.prestamo.cuotaMensual = nuevoMontoCuota;
        if (this.prestamo.saldo === 0) {
          this.prestamo.estado = 'Finalizado';
        }
        this.prestamoService.editarPrestamo(this.id, this.prestamo).subscribe(data => {
          this.toastr.success('Abono realizado con éxito');
          this.router.navigate(['/listar-prestamos']);
        }, error => {
          this.toastr.error('Error al realizar el abono');
          console.error(error);
        });
      } else {
        this.toastr.error('El abono no puede ser mayor al saldo del préstamo');
      }
    } else if (!this.prestamo) {
      this.toastr.error('No se ha cargado ningún préstamo para abonar');
    }
  }
}