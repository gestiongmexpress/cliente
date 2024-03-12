import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroTicket } from '../models/registroTicket';

@Injectable({
  providedIn: 'root'
})
export class RegistroTicketService {
  private apiUrl = 'https://gmexpress.onrender.com/api/registroTicket';

  constructor(private http: HttpClient) { }

  crearRegistroTicket(registroTicket: RegistroTicket): Observable<RegistroTicket> {
    return this.http.post<RegistroTicket>(this.apiUrl, registroTicket);
  }

  obtenerTodosLosRegistrosTickets(): Observable<RegistroTicket[]> {
    return this.http.get<RegistroTicket[]>(this.apiUrl);
  }

  obtenerRegistroTicket(id: string): Observable<RegistroTicket> {
    return this.http.get<RegistroTicket>(`${this.apiUrl}/${id}`);
  }

  actualizarRegistroTicket(id: string, registroTicket: Partial<RegistroTicket>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, registroTicket);
  }

  eliminarRegistroTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}