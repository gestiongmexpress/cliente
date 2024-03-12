import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asistencia } from '../models/asistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'https://gmexpress.onrender.com/api/asistencia';

  constructor(private http: HttpClient) { }

  getAsistencias(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(this.apiUrl);
  }

  eliminarAsistencia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarAsistencia(asistencia: Asistencia): Observable<any> {
    return this.http.post(this.apiUrl, asistencia);
  }

  obtenerAsistencia(id: string): Observable<Asistencia> {
    return this.http.get<Asistencia>(`${this.apiUrl}/${id}`);
  }

  editarAsistencia(id: string, asistencia: Partial<Asistencia>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, asistencia);
  }

  crearAsistenciasMasivas(data: { trabajadorId: string; mes: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearMasivo`, data);
  }

  obtenerAsistenciasPorTrabajadorYMes(trabajadorId: string, inicioMes: string): Observable<Asistencia[]> {
    const queryParams = new HttpParams()
      .set('trabajadorId', trabajadorId)
      .set('inicioMes', inicioMes);
    return this.http.get<Asistencia[]>(`${this.apiUrl}/porMes`, { params: queryParams });
  }
}