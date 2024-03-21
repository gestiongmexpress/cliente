import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from '../models/prestamo'; 

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = 'https://gmexpress.onrender.com/api/prestamos'; 

  constructor(private http: HttpClient) { }

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  eliminarPrestamo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  guardarPrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.post(this.apiUrl, prestamo);
  }

  obtenerPrestamo(id: string): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  editarPrestamo(id: string, prestamo: Partial<Prestamo>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, prestamo);
  }
}