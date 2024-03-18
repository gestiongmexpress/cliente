import { Component, OnInit } from '@angular/core';
import { RegistroTicketService } from '../../services/registroTicket.service';
import { RegistroTicket } from '../../models/registroTicket';
import { DateFormatService } from '../../services/date-format.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-listar-tickets',
  templateUrl: './listar-tickets.component.html',
  styleUrls: ['./listar-tickets.component.css']
})
export class ListarTicketsComponent implements OnInit {
  tickets: RegistroTicket[] = [];
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);
  ticketsFiltrados: RegistroTicket[] = [];
  empresas: Empresa[] = [];
  filtroForm: FormGroup;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private registroTicketService: RegistroTicketService, public dateFormatService: DateFormatService, private toastr: ToastrService) {
    this.filtroForm = this.fb.group({
      empresa: [''],
      estadoEmpresa: ['Si'],
      ordenCompra: [''],
      estadoTicket: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTickets();
    this.cargarEmpresas();
    this.filtroForm.valueChanges.subscribe(filtros => {
      this.aplicarFiltros(filtros);
    });
  }

  cargarTickets(): void {
    this.registroTicketService.obtenerTodosLosRegistrosTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets.map(ticket => {
          ticket.vigencia = this.esVigente(new Date(ticket.fechaCaducidad));
          return ticket;
        });
        this.ticketsFiltrados = [...this.tickets];
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al cargar los tickets');
      }
    });
  }

  getEmpresaNombre(ticket: RegistroTicket): string {
    if (typeof ticket.empresa === 'string') {
      return 'Nombre basado en ID';
    } else {
      return ticket.empresa.nombre;
    }
  }

  getEstadoEmpresa(ticket: RegistroTicket): string {
    if (typeof ticket.empresa === 'object' && ticket.empresa) {
      return ticket.empresa.vigente === 'Si' ? 'Vigente' : 'No Vigente';
    } else {
      return 'Desconocido';
    }
  }
  

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  aplicarFiltros(filtros: any): void {
    this.ticketsFiltrados = this.tickets.filter(ticket => {
      let empresaMatch = true;
      let estadoEmpresaMatch = true;
      if (filtros.empresa) {
        empresaMatch = typeof ticket.empresa === 'string' ?
          ticket.empresa === filtros.empresa :
          ticket.empresa._id === filtros.empresa;
      }
      if (filtros.estadoEmpresa) {
        estadoEmpresaMatch = typeof ticket.empresa === 'object' &&
          (ticket.empresa.vigente === filtros.estadoEmpresa);
      }
      const ordenCompraMatch = !filtros.ordenCompra || ticket.ordenCompra === filtros.ordenCompra;
      const estadoTicketMatch = !filtros.estadoTicket || ticket.estado === filtros.estadoTicket;
      return empresaMatch && estadoEmpresaMatch && ordenCompraMatch && estadoTicketMatch;
    });
  }

  cambiarEstado(ticketId: string, nuevoEstado: string | null): void {
    if (ticketId === undefined || nuevoEstado === null) {
      console.error('Ticket ID o nuevo estado es nulo');
      this.toastr.error('Error al actualizar el estado del ticket. El ID del ticket o el nuevo estado es nulo.', 'Error');
      return;
    }
    this.registroTicketService.actualizarRegistroTicket(ticketId, { estado: nuevoEstado })
      .subscribe({
        next: (respuesta) => {
          console.log('Estado actualizado con éxito', respuesta);
          this.toastr.success('Estado del ticket actualizado con éxito.', 'Éxito');
          this.cargarTickets();
        },
        error: (error) => {
          console.error('Error al actualizar el estado del ticket', error);
          this.toastr.error('Error al actualizar el estado del ticket.', 'Error');
        }
      });
  }

  onSelectEstadoChange(ticketId: string | undefined, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;
    if (ticketId) {
      this.cambiarEstado(ticketId, nuevoEstado);
    }
  }

  esVigente(fechaCaducidad: Date): string {
    const hoy = new Date();
    return hoy < fechaCaducidad ? 'Vigente' : 'No Vigente';
  }  
}