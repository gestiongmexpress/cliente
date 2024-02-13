import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { RespuestaAuth } from '../models/respuesta-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gmexpress.onrender.com/api/usuario';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, usuario);
  }

  loginUsuario(usuario: Usuario): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${this.apiUrl}/login`, usuario);
  }

  getUsuarioActual(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload; // Retorna el payload del token que contiene la información del usuario
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        return null;
      }
    }
    return null;
  }

}