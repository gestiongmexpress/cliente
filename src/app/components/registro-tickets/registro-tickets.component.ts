import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsoTicketService } from '../../services/usoTicket.service';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-tickets',
  templateUrl: './registro-tickets.component.html',
  styleUrls: ['./registro-tickets.component.css']
})
export class RegistroTicketsComponent implements OnInit {
  usoTicketForm: FormGroup;
  empresas: Empresa[] = [];
  servicios = ['Canje', 'Tradicional', 'Transportado'];
  minYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private usoTicketService: UsoTicketService,
    private empresaService: EmpresaService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.usoTicketForm = this.fb.group({
      fecha: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      empresa: ['', Validators.required],
      ticketPendiente: [''],
      cuantos: [''],
      servicio: ['', Validators.required],
      observacion: [''],
      ano: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error) => {
        console.error('Error al cargar las empresas', error);
      }
    });
  }

  onSubmit(): void {
    if (this.usoTicketForm.valid) {
      this.usoTicketService.crearUsoTicket(this.usoTicketForm.value).subscribe({
        next: (usoTicket) => {
          this.toastr.success('Uso de ticket registrado con éxito!');
          this.router.navigate(['/listar-tickets']);
        },
        error: (error) => {
          console.error('Error al registrar el uso del ticket', error);
          this.toastr.error('Error al registrar el uso del ticket');
        }
      });
    }
  }
}