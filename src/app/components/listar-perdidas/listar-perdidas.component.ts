import { Component, OnInit } from '@angular/core';
import { RegistroPerdidaService } from '../../services/registroPerdida.service';
import { RegistroPerdida } from '../../models/registroPerdida';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-listar-perdidas',
  templateUrl: './listar-perdidas.component.html',
  styleUrls: ['./listar-perdidas.component.css']
})
export class ListarPerdidasComponent implements OnInit {
  perdidas: RegistroPerdida[] = [];
  empresas: Empresa[] = [];
  perdidasFiltradas: RegistroPerdida[] = [];
  filtroForm: FormGroup;
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private registroPerdidaService: RegistroPerdidaService,
              private empresaService: EmpresaService,
              private fb: FormBuilder,
              public dateFormatService: DateFormatService) {
                this.filtroForm = this.fb.group({
                  empresa: [''],
                  estado: [''],
                  fechaInicio: [''],
                  fechaFin: ['']
                });
              }

  ngOnInit(): void {
    const hoy = new Date();
    const haceTreintaDias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
    this.filtroForm.patchValue({
      fechaInicio: haceTreintaDias.toISOString().slice(0, 10),
      fechaFin: hoy.toISOString().slice(0, 10),
    });
    this.cargarEmpresas();
    this.aplicarFiltros();
    this.filtroForm.valueChanges.subscribe(valoresFiltro => {
      this.aplicarFiltros(valoresFiltro);
    });
  }


  cargarPerdidas(): void {
    this.registroPerdidaService.obtenerTodosLosRegistrosPerdidas().subscribe({
      next: (datos) => {
        this.perdidas = datos;
      },
      error: (error) => {
        console.error('Error al obtener los registros de pérdidas', error);
      }
    });
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error) => {
        console.error('Error al cargar las empresas', error);
      }
    });
  }

  aplicarFiltros(filtros: any = this.filtroForm.value): void {
    this.registroPerdidaService.obtenerTodosLosRegistrosPerdidas().subscribe({
      next: (datos) => {
        let resultados = datos;
        if (filtros.empresa) {
          resultados = resultados.filter(p => p.empresa === filtros.empresa || (p.empresa as Empresa)._id === filtros.empresa);
        }
        if (filtros.estado) {
          resultados = resultados.filter(p => p.estado === filtros.estado);
        }
        if (filtros.fechaInicio) {
          resultados = resultados.filter(p => new Date(p.fecha) >= new Date(filtros.fechaInicio));
        }
        if (filtros.fechaFin) {
          resultados = resultados.filter(p => new Date(p.fecha) <= new Date(filtros.fechaFin));
        }
        this.perdidasFiltradas = resultados;
      },
      error: (error) => console.error('Error al obtener los registros de pérdidas', error)
    });
  }

  getEmpresaNombre(perdida: RegistroPerdida): string {
    if (typeof perdida.empresa === 'string') {
      const empresa = this.empresas.find(e => e._id === perdida.empresa);
      return empresa ? empresa.nombre : 'Nombre no disponible';
    } else {
      return perdida.empresa.nombre;
    }
  }

  eliminarPerdida(id: string): void {
    if (confirm('¿Estás seguro de querer eliminar esta pérdida?')) {
      this.registroPerdidaService.eliminarRegistroPerdida(id).subscribe({
        next: () => {
          this.aplicarFiltros();
        },
        error: (error) => {
          console.error('Error al eliminar la pérdida', error);
        }
      });
    }
  }
  
}