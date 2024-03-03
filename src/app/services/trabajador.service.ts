import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajador } from '../models/trabajador'; 
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'https://gmexpress.onrender.com/api/trabajadores';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  eliminarTrabajador(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarTrabajador(trabajador: Trabajador): Observable<any> {
    return this.http.post(this.apiUrl, trabajador);
  }

  obtenerTrabajador(id: string): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`);
  }

  editarTrabajador(id: string, trabajador: Partial<Trabajador>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trabajador);
  }

  proximoVencimientoContrato(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.apiUrl}/contratoPr`);
  }
  
  proximoCumpleanos(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.apiUrl}/cumplePr`);
  }

  proximoContratoVencido(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.apiUrl}/contratoV`);
  }  
}