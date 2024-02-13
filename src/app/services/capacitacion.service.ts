import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Capacitacion } from '../models/capacitacion';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {
  private apiUrl = 'https://gmexpress.onrender.com/api/capacitacion';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCapacitaciones(): Observable<Capacitacion[]> {
    return this.http.get<Capacitacion[]>(this.apiUrl);
  }

  eliminarCapacitacion(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  guardarCapacitacion(capacitacion: Capacitacion): Observable<any> {
    return this.http.post(this.apiUrl, capacitacion);
  }

  obtenerCapacitacion(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id);
  }

  editarCapacitacion(id: string, capacitacion: Partial<Capacitacion>): Observable<any> {
    const usuario = this.authService.getUsuarioActual();
    if (usuario) {
      capacitacion.ultimoEditor = usuario.username;
      capacitacion.rolEditor = usuario.rol;
    }

    return this.http.put(`${this.apiUrl}/${id}`, capacitacion);
  }

  editarEnlacesCapacitacion(id: string, enlaces: { asistentes?: string; nota?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, enlaces);
  }

  actualizarEnlace(idCapacitacion: string, campo: 'asistentes' | 'nota', enlace: string): Observable<any> {
    const actualizacion = { [campo]: enlace };
    return this.http.patch(`${this.apiUrl}/${idCapacitacion}`, actualizacion);
  }
  
}