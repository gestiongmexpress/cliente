import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroPerdida } from '../models/registroPerdida';

@Injectable({
  providedIn: 'root'
})
export class RegistroPerdidaService {
  private apiUrl = 'https://gmexpress.onrender.com/api/registroPerdida';

  constructor(private http: HttpClient) { }

  crearRegistroPerdida(registroPerdida: RegistroPerdida): Observable<RegistroPerdida> {
    return this.http.post<RegistroPerdida>(this.apiUrl, registroPerdida);
  }

  obtenerTodosLosRegistrosPerdidas(): Observable<RegistroPerdida[]> {
    return this.http.get<RegistroPerdida[]>(this.apiUrl);
  }

  obtenerRegistroPerdida(id: string): Observable<RegistroPerdida> {
    return this.http.get<RegistroPerdida>(`${this.apiUrl}/${id}`);
  }

  actualizarRegistroPerdida(id: string, registroPerdida: Partial<RegistroPerdida>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, registroPerdida);
  }

  eliminarRegistroPerdida(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}