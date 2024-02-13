import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mantencion } from '../models/mantencion';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MantencionService {
  private apiUrl = 'https://gmexpress.onrender.com/api/mantencion';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMantenciones(): Observable<Mantencion[]> {
    return this.http.get<Mantencion[]>(this.apiUrl);
  }

  eliminarMantencion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarMantencion(mantencion: Mantencion): Observable<any> {
    return this.http.post(this.apiUrl, mantencion);
  }

  obtenerMantencion(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarMantencion(id: string, mantencion: Partial<Mantencion>): Observable<any> {
    const usuario = this.authService.getUsuarioActual();
    if (usuario) {
      mantencion.ultimoEditor = usuario.username;
      mantencion.rolEditor = usuario.rol;
    }
    return this.http.put(`${this.apiUrl}/${id}`, mantencion);
  }

}
