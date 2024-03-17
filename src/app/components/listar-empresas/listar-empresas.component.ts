import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listar-empresas',
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.css']
})
export class ListarEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  filtroForm: FormGroup;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private router: Router, private toastr: ToastrService) {
    this.filtroForm = this.fb.group({
      vigente: ['Si'],
      ordenCompra: [''],
      sucursal: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.filtroForm.valueChanges.subscribe(filtros => {
      this.aplicarFiltros(filtros);
    });
  }

  aplicarFiltros(filtros: any): void {
    this.empresasFiltradas = this.empresas.filter(empresa => {
      const vigenteMatch = filtros.vigente ? empresa.vigente === filtros.vigente : true;
      const ordenCompraMatch = filtros.ordenCompra ? empresa.ordenCompra === filtros.ordenCompra : true;
      const sucursalMatch = filtros.sucursal ? empresa.sucursal.includes(filtros.sucursal) : true;
      return vigenteMatch && ordenCompraMatch && sucursalMatch;
    });
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
        this.aplicarFiltros(this.filtroForm.value);
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

  actualizarEstadoEmpresa(id: string, campo: 'vigente' | 'ordenCompra', event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    const valorActualizado = elemento.value as 'Si' | 'No';
    this.empresaService.actualizarEmpresa(id, { [campo]: valorActualizado }).subscribe({
      next: () => {
        this.toastr.success('Empresa actualizada con éxito');
        this.cargarEmpresas();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al actualizar la empresa');
      }
    });
  }
}