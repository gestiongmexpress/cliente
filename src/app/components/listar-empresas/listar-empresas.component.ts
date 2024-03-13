import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.css']
})
export class ListarEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];

  constructor(private empresaService: EmpresaService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al cargar las empresas');
      }
    });
  }

  editarEmpresa(id: string): void {
    this.router.navigate(['/editar-empresa', id]);
  }

  eliminarEmpresa(id: string): void {
    const confirmacion = confirm('¿Estás seguro de querer eliminar esta empresa?');
    if (confirmacion) {
      this.empresaService.eliminarEmpresa(id).subscribe({
        next: () => {
          this.toastr.success('Empresa eliminada con éxito');
          this.cargarEmpresas();
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('Error al eliminar la empresa');
        }
      });
    }
  }
}