import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plaga } from '../models/plaga';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlagaService {
  private apiUrl = 'https://gmexpress.onrender.com/api/plaga';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPlagas(): Observable<Plaga[]> {
    return this.http.get<Plaga[]>(this.apiUrl);
  }

  eliminarPlaga(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarPlaga(plaga: Plaga): Observable<any> {
    return this.http.post(this.apiUrl, plaga);
  }

  obtenerPlaga(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarPlaga(id: string, plaga: Partial<Plaga>): Observable<any> {
    const usuario = this.authService.getUsuarioActual();
    if (usuario) {
        plaga.ultimoEditor = usuario.username;
        plaga.rolEditor = usuario.rol;
    }
    return this.http.put(`${this.apiUrl}/${id}`, plaga);
  }

}