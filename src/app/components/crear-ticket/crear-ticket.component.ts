import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { RegistroTicketService } from '../../services/registroTicket.service';
import { Empresa } from '../../models/empresa';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-ticket',
  templateUrl: './crear-ticket.component.html',
  styleUrls: ['./crear-ticket.component.css']
})
export class CrearTicketComponent implements OnInit {
  ticketForm: FormGroup;
  empresas: Empresa[] = [];
  empresaSeleccionada?: Empresa;
  totalCalculado: number = 0;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private registroTicketService: RegistroTicketService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.ticketForm = this.fb.group({
      fecha: ['', Validators.required],
      empresa: ['', Validators.required],
      ordenCompra: ['', Validators.required],
      talonarios: ['', [Validators.required, Validators.min(1)]],
      total: [''],
      unidades: ['', [Validators.required, Validators.min(1)]],
      folioInicial: ['', [Validators.required, Validators.min(0)]],
      folioFinal: ['', [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
      fechaCaducidad: ['', Validators.required],
      vigencia: [''],
      facturado: ['', Validators.required],
      mesFactura: [''],
      factura: [''],
      totalNeto: ['', [Validators.required, Validators.min(0)]],
      totalFactura: ['', [Validators.required, Validators.min(0)]],
      observacion: [''],
      facturacion: [''],
      ano: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.ticketForm.get('empresa')?.valueChanges.subscribe(val => this.onEmpresaChange(val));
    this.ticketForm.get('talonarios')?.valueChanges.subscribe(() => this.calcularTotales());
    this.ticketForm.get('unidades')?.valueChanges.subscribe(() => this.calcularTotales());
    this.ticketForm.get('folioInicial')?.valueChanges.subscribe(() => this.calcularFolioFinal());
    this.ticketForm.get('fecha')?.valueChanges.subscribe(val => {
      if (val) {
        this.calcularFechaCaducidad(val);
      }
    });
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    }, error => {
      console.error('Error al cargar empresas', error);
      this.toastr.error('Error al cargar empresas');
    });
  }

  onEmpresaChange(empresaId: string): void {
    this.empresaSeleccionada = this.empresas.find(e => e._id === empresaId);
    if (this.empresaSeleccionada) {
      this.ticketForm.patchValue({
        rut: this.empresaSeleccionada.rut,
        vigente: this.empresaSeleccionada.vigente,
        ordenCompra: this.empresaSeleccionada.ordenCompra,
        facturacion: this.empresaSeleccionada.facturacion,
        valor: this.empresaSeleccionada.valorNeto
      });
      this.calcularTotales();
    }
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const formValue = this.ticketForm.value;
      const registroData: any = {
        ...formValue,
        valor: this.empresaSeleccionada?.valorNeto
      };
      this.registroTicketService.crearRegistroTicket(registroData).subscribe({
          next: (registroTicket) => {
              this.toastr.success('Ticket creado con éxito', 'Registro exitoso');
              this.router.navigate(['/listar-tickets']);
          },
          error: (error) => {
              console.error('Error al crear ticket', error);
              this.toastr.error('Error al crear ticket');
          }
        });
      } else {
        let errorMessages: string[] = [];
        Object.keys(this.ticketForm.controls).forEach(key => {
            const control = this.ticketForm.get(key);
            if (control && control.errors) {
                Object.keys(control.errors).forEach(keyError => {
                    errorMessages.push(`El campo ${key} es inválido debido a: ${keyError}.`);
                });
            }
        });
        this.toastr.error('Por favor, completa el formulario correctamente.\n' + (errorMessages.length > 0 ? errorMessages.join('\n') : 'Revisa todos los campos.'));
    }
  }

  calcularTotales(): void {
    const talonarios = this.ticketForm.get('talonarios')?.value || 0;
    const unidades = this.ticketForm.get('unidades')?.value || 0;
    this.totalCalculado = talonarios * unidades;
    const valorNeto = this.empresaSeleccionada?.valorNeto || 0;
    const totalNeto = this.totalCalculado * valorNeto;
    const totalFactura = totalNeto * 1.19;
    this.ticketForm.patchValue({
        total: this.totalCalculado,
        totalNeto: totalNeto.toFixed(2),
        totalFactura: totalFactura.toFixed(2)
    });
    this.calcularFolioFinal();
  }

  calcularFolioFinal(): void {
    const folioInicial = this.ticketForm.get('folioInicial')?.value || 0;
    this.ticketForm.patchValue({
      folioFinal: folioInicial + this.totalCalculado - 1
    });
  }

  calcularFechaCaducidad(fecha: string): void {
    const fechaEntrega = new Date(fecha);
    fechaEntrega.setMonth(fechaEntrega.getMonth() + 3);
    const fechaCaducidad = fechaEntrega.toISOString().split('T')[0];
    this.ticketForm.patchValue({
      fechaCaducidad: fechaCaducidad
    });
  }
}