import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MantencionService } from '../../services/mantencion.service'; 
import { Mantencion } from '../../models/mantencion'; 

@Component({
  selector: 'app-crear-mantencion',
  templateUrl: './crear-mantencion.component.html',
  styleUrls: ['./crear-mantencion.component.css']
})
export class CrearMantencionComponent implements OnInit {
  mantencionForm: FormGroup;
  titulo = 'Crear Mantención';
  id: string | null;
  filtroSucursal: string;
  filtroAno: string;
  filtroArea: string;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService, 
    private _mantencionService: MantencionService,
    private aRouter: ActivatedRoute,
    private route: ActivatedRoute
  ) {
    this.mantencionForm = this.fb.group({
      nombre: ['', Validators.required],
      observacion: [''],
      codigo: [''],
      sucursal: ['', Validators.required],
      mes: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(2023)]],
      area: ['', Validators.required],
      encargado: ['', Validators.required],
      proveedor: [''],
      fechaRealizacion: [''] 
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.filtroSucursal = '';
    this.filtroAno = '';
    this.filtroArea = '';
  }

  esModoEdicion = false;

  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.esModoEdicion = !!this.id;
    this.route.queryParams.subscribe(params => {
      this.filtroSucursal = params['sucursal'] || '';
      this.filtroAno = params['ano'] || '';
      this.filtroArea = params['area'] || '';
    });
    this.esEditar();
  }

  agregarMantencion() {
    if (this.mantencionForm.valid) {
        const mantencion: Mantencion = this.mantencionForm.value;
        if (mantencion.proveedor && mantencion.fechaRealizacion) {
            mantencion.estado = 'Realizado';
        } else {
            mantencion.estado = 'Pendiente';
        }
        const request = this.id
            ? this._mantencionService.editarMantencion(this.id, mantencion)
            : this._mantencionService.guardarMantencion(mantencion);
        request.subscribe({
            next: (data) => {
                const message = this.id
                    ? 'Mantención actualizada con éxito'
                    : 'Mantención registrada con éxito';
                this.toastr.success(message);
                this.router.navigate(['/listar-mantencion'], {
                    queryParams: {
                        sucursal: this.filtroSucursal,
                        ano: this.filtroAno,
                        area: this.filtroArea,
                    },
                });
            },
            error: (error) => {
                this.toastr.error('Error al procesar la mantención');
                console.error(error);
            },
        });
    }
  }


  esEditar() {
    if (this.id) {
      this.titulo = 'Editar Mantención';
      this._mantencionService.obtenerMantencion(this.id).subscribe(data => {
        const fechaRealizacionFormatted = data.fechaRealizacion ? new Date(data.fechaRealizacion).toISOString().split('T')[0] : '';
        this.mantencionForm.patchValue({
          ...data,
          fechaRealizacion: fechaRealizacionFormatted,
        });
      });
    }
  }
}