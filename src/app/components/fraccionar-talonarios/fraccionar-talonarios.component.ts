import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroTicketService } from '../../services/registroTicket.service';
import { RegistroTicket } from '../../models/registroTicket';

@Component({
  selector: 'app-fraccionar-talonarios',
  templateUrl: './fraccionar-talonarios.component.html',
  styleUrls: ['./fraccionar-talonarios.component.css']
})
export class FraccionarTalonariosComponent implements OnInit {
  fraccionarForm!: FormGroup;
  ticketOriginal: RegistroTicket | null = null;
  estados: string[] = ['Pendiente', 'Creado', 'Disponible', 'Entregado', 'Impreso', 'Nulo'];

  constructor(
    private fb: FormBuilder,
    private registroTicketService: RegistroTicketService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fraccionarForm = this.fb.group({
      talonariosAFraccionar: ['', [Validators.required, Validators.min(1)]],
      nuevoEstado: ['', Validators.required]
    });
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.cargarTicket(ticketId);
    } else {
      this.toastr.error('No se especificó un ticket válido.');
      this.router.navigate(['/listar-tickets']);
    }
  }

  cargarTicket(id: string): void {
    this.registroTicketService.obtenerRegistroTicket(id).subscribe({
      next: (ticket) => {
        this.ticketOriginal = ticket;
        this.fraccionarForm.controls['talonariosAFraccionar'].setValidators([
          Validators.required,
          Validators.max(this.ticketOriginal.talonarios - 1),
          Validators.min(1)
        ]);
        this.fraccionarForm.controls['talonariosAFraccionar'].updateValueAndValidity();
      },
      error: (error) => {
        this.toastr.error('Error al cargar el ticket.');
        this.router.navigate(['/listar-tickets']);
      }
    });
  }

  onSubmit(): void {
    if (!this.ticketOriginal || !this.fraccionarForm.valid) {
      this.toastr.error('Por favor, completa el formulario correctamente.');
      return;
    }
    const talonariosAFraccionar = this.fraccionarForm.get('talonariosAFraccionar')?.value;
    const nuevoEstado = this.fraccionarForm.get('nuevoEstado')?.value;
    const totalTalonariosOriginal = this.ticketOriginal.talonarios;
    if (talonariosAFraccionar >= totalTalonariosOriginal) {
      this.toastr.error('La cantidad de talonarios a fraccionar debe ser menor al total de talonarios.');
      return;
    }
    const unidadesPorTalonario = this.ticketOriginal.unidades;
    const foliosPorTalonario = (this.ticketOriginal.folioFinal - this.ticketOriginal.folioInicial + 1) / totalTalonariosOriginal;
    const nuevoFolioFinalOriginal = Math.round(this.ticketOriginal.folioInicial + foliosPorTalonario * (totalTalonariosOriginal - talonariosAFraccionar) - 1);
    const ticketOriginalActualizado: Partial<RegistroTicket> = {
      talonarios: totalTalonariosOriginal - talonariosAFraccionar,
      folioFinal: nuevoFolioFinalOriginal,
      total: (totalTalonariosOriginal - talonariosAFraccionar) * unidadesPorTalonario,
    };
    this.registroTicketService.actualizarRegistroTicket(this.ticketOriginal._id!, ticketOriginalActualizado).subscribe({
      next: (response) => {
        this.toastr.success('Registro actualizado correctamente.');
        const nuevoTicket: Partial<RegistroTicket> = {
          ...this.ticketOriginal,
          talonarios: talonariosAFraccionar,
          folioInicial: nuevoFolioFinalOriginal + 1,
          folioFinal: this.ticketOriginal!.folioFinal,
          total: talonariosAFraccionar * unidadesPorTalonario,
          estado: nuevoEstado,
        };
        delete nuevoTicket._id;
        this.registroTicketService.crearRegistroTicket(nuevoTicket as RegistroTicket).subscribe({
          next: (newTicketResponse) => {
            this.router.navigate(['/listar-tickets']);
          },
          error: (error) => {
            console.error('Error al crear el ticket fraccionado:', error);
            this.toastr.error('Error al crear el ticket fraccionado.');
          }
        });
      },
      error: (error) => {
        console.error('Error al actualizar el ticket original:', error);
        this.toastr.error('Error al actualizar el ticket original.');
      }
    });
  }
}
