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
      unidades: ['', [Validators.required, Validators.min(1)]],
      total: ['', [Validators.required, Validators.min(1)]],
      folioInicial: ['', [Validators.required, Validators.min(0)]],
      folioFinal: ['', [Validators.required, Validators.min(0)]],
      estado: ['Pendiente', Validators.required],
      fechaCaducidad: ['', Validators.required],
      vigencia: ['', Validators.required],
      facturado: ['', Validators.required],
      mesFactura: [''],
      factura: [''],
      totalNeto: ['', [Validators.required, Validators.min(0)]],
      totalFactura: ['', [Validators.required, Validators.min(0)]],
      observacion: [''],
      facturacion: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1900)]]
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.ticketForm.get('empresaId')?.valueChanges.subscribe(val => this.onEmpresaChange(val));
    this.ticketForm.get('talonarios')?.valueChanges.subscribe(() => this.calcularTotales());
    this.ticketForm.get('unidades')?.valueChanges.subscribe(() => this.calcularTotales());
    this.ticketForm.get('folioInicial')?.valueChanges.subscribe(() => this.calcularFolioFinal());
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
    const empresaSeleccionada = this.empresas.find(e => e._id === empresaId);
    if (empresaSeleccionada) {
      this.ticketForm.patchValue({
        rut: empresaSeleccionada.rut,
        vigente: empresaSeleccionada.vigente,
        ordenCompra: empresaSeleccionada.ordenCompra
      });
    }
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.registroTicketService.crearRegistroTicket(this.ticketForm.value).subscribe({
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
      this.toastr.error('Por favor, completa el formulario correctamente.');
    }
  }

  calcularTotales(): void {
    const talonarios = this.ticketForm.get('talonarios')?.value || 0;
    const unidades = this.ticketForm.get('unidades')?.value || 0;
    const total = talonarios * unidades;
    const folioInicial = this.ticketForm.get('folioInicial')?.value || 0;
    const folioFinal = parseInt(folioInicial, 10) + total - 1;
    const empresaSeleccionada = this.empresas.find(e => e._id === this.ticketForm.get('empresaId')?.value);
    if (empresaSeleccionada) {
      const valorNeto = empresaSeleccionada.valorNeto;
      const totalNeto = total * valorNeto;
      const totalFactura = totalNeto * 1.19;
      this.ticketForm.patchValue({
        total: total,
        folioFinal: folioFinal,
        totalNeto: totalNeto,
        totalFactura: totalFactura
      });
    }
  }  
  calcularFolioFinal(): void {
    const folioInicial = this.ticketForm.get('folioInicial')?.value || 0;
    const total = this.ticketForm.get('total')?.value || 0;
    const folioFinal = parseInt(folioInicial, 10) + total;
    this.ticketForm.patchValue({folioFinal: folioFinal});
  }
}