import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'https://gmexpress.onrender.com/api/empresa';

  constructor(private http: HttpClient) { }

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  obtenerTodasEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  obtenerEmpresa(id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  actualizarEmpresa(id: string, empresa: Partial<Empresa>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, empresa);
  }

  eliminarEmpresa(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}