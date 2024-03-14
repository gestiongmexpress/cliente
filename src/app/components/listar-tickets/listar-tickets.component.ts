import { Component, OnInit } from '@angular/core';
import { RegistroTicketService } from '../../services/registroTicket.service';
import { RegistroTicket } from '../../models/registroTicket';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-listar-tickets',
  templateUrl: './listar-tickets.component.html',
  styleUrls: ['./listar-tickets.component.css']
})
export class ListarTicketsComponent implements OnInit {
  tickets: RegistroTicket[] = [];
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private registroTicketService: RegistroTicketService, public dateFormatService: DateFormatService) { }

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.registroTicketService.obtenerTodosLosRegistrosTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: (e) => console.error(e)
    });
  }

  getEmpresaNombre(ticket: RegistroTicket): string {
    if (typeof ticket.empresa === 'string') {
      return 'Nombre basado en ID';
    } else {
      return ticket.empresa.nombre;
    }
  }
}
