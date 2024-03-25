import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroPerdidaService } from '../../services/registroPerdida.service';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-perdida',
  templateUrl: './registrar-perdida.component.html',
  styleUrl: './registrar-perdida.component.css'
})
export class RegistrarPerdidaComponent implements OnInit {
  registroPerdidaForm: FormGroup;
  empresas: Empresa[] = [];

  constructor(
    private fb: FormBuilder,
    private registroPerdidaService: RegistroPerdidaService,
    private toastr: ToastrService,
    private empresaService: EmpresaService,
    public router: Router
  ) {
    this.registroPerdidaForm = this.fb.group({
      fecha: ['', Validators.required],
      empresa: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      estado: ['Perdidos', Validators.required],
      ano: [new Date().getFullYear(), Validators.required],
      observacion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerTodasEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  onSubmit(): void {
    if (this.registroPerdidaForm.valid) {
      this.registroPerdidaService.crearRegistroPerdida(this.registroPerdidaForm.value).subscribe({
        next: (registro) => {
          this.toastr.success('Registro de pérdida creado con éxito.');
          this.router.navigate(['/listar-perdidas']);
        },
        error: (error) => {
          this.toastr.error('Hubo un error al crear el registro de pérdida.');
          console.error(error);
        }
      });
    }
  }
}