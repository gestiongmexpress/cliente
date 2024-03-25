import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.css']
})
export class CrearEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  titulo = 'Crear Empresa';
  id: string | null;
  esModoEdicion: boolean = false;
  valorNetoOriginal?: number;

  constructor(
    private fb: FormBuilder, 
    public router: Router, 
    private toastr: ToastrService, 
    private _empresaService: EmpresaService,
    private aRouter: ActivatedRoute
  ) {
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required],
      vigente: ['', Validators.required],
      ordenCompra: ['', Validators.required],
      colorFondoAsignado: [''],
      colorLetraAsignado: [''],
      valorNeto: ['', [Validators.required, Validators.min(1)]],
      servicioNegociado: ['', Validators.required],
      tipoServicio: ['', Validators.required],
      contenedorVidrio: [''],
      sucursal: ['', Validators.required],
      coloresTraspasadosA: [''],
      facturacion: ['', Validators.required],
      valorAnterior: [null],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esModoEdicion = !!this.id;
    if (this.esModoEdicion) {
      this.esEditar();
    }
  }

  agregarOEditarEmpresa() {
    if (this.empresaForm.valid) {
      if (this.esModoEdicion && this.valorNetoOriginal !== this.empresaForm.get('valorNeto')?.value) {
        this.empresaForm.get('valorAnterior')?.setValue(this.valorNetoOriginal);
      }
      if (this.esModoEdicion) {
        this._empresaService.actualizarEmpresa(this.id!, this.empresaForm.value).subscribe({
          next: (data) => {
            this.toastr.info('Empresa actualizada con éxito', 'Actualización exitosa');
            this.router.navigate(['/listar-empresas']);
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Error al actualizar la empresa');
          }
        });
      } else {
        this._empresaService.crearEmpresa(this.empresaForm.value).subscribe({
          next: (data) => {
            this.toastr.success('Empresa creada con éxito', 'Registro exitoso');
            this.router.navigate(['/listar-empresas']);
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Error al crear la empresa');
          }
        });
      }
    }
  }

  esEditar() {
    this.titulo = 'Editar Empresa';
    this._empresaService.obtenerEmpresa(this.id!).subscribe({
      next: (data) => {
        this.empresaForm.patchValue(data);
        this.valorNetoOriginal = data.valorNeto;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos de la empresa', 'Error');
        console.error('Error al obtener los datos de la empresa:', error);
      }
    });
  }
}