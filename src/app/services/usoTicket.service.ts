import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsoTicket } from '../models/usoTicket';

@Injectable({
  providedIn: 'root'
})
export class UsoTicketService {
  private apiUrl = 'https://gmexpress.onrender.com/api/usoTicket';

  constructor(private http: HttpClient) { }

  crearUsoTicket(usoTicket: UsoTicket): Observable<UsoTicket> {
    return this.http.post<UsoTicket>(this.apiUrl, usoTicket);
  }

  obtenerTodosLosUsosTickets(): Observable<UsoTicket[]> {
    return this.http.get<UsoTicket[]>(this.apiUrl);
  }

  obtenerUsoTicket(id: string): Observable<UsoTicket> {
    return this.http.get<UsoTicket>(`${this.apiUrl}/${id}`);
  }

  actualizarUsoTicket(id: string, usoTicket: Partial<UsoTicket>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usoTicket);
  }

  eliminarUsoTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}