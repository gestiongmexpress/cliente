import { Component, OnInit } from '@angular/core';
import { PrestamoService } from '../../services/prestamo.service';
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Prestamo } from '../../models/prestamo';
import { Trabajador } from '../../models/trabajador'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-listar-prestamos',
  templateUrl: './listar-prestamos.component.html',
  styleUrls: ['./listar-prestamos.component.css']
})

export class ListarPrestamosComponent implements OnInit {
  prestamos: Prestamo[] = [];
  trabajadores: Trabajador[] = []; 
  prestamosFiltrados: Prestamo[] = [];
  filtroForm: FormGroup;

  constructor(
    private prestamoService: PrestamoService,
    private trabajadorService: TrabajadorService, 
    private fb: FormBuilder, 
    private router: Router, 
    public dateFormatService: DateFormatService
  ) {
    this.filtroForm = this.fb.group({
      trabajador: [''],
      estado: [''],
    });
  }

  ngOnInit(): void {
    this.prestamoService.getPrestamos().subscribe(data => {
      this.prestamos = data;
      this.prestamosFiltrados = data;
    });

    this.trabajadorService.getTrabajadores().subscribe(data => { 
      this.trabajadores = data;
    });

    this.filtroForm.valueChanges.subscribe(valoresFiltro => {
      this.filtrarPrestamos(valoresFiltro);
    });
  }

  filtrarPrestamos(filtros: any): void {
    let prestamosTemp = [...this.prestamos]; 
    if (filtros.trabajador) {
      prestamosTemp = prestamosTemp.filter(p => p.trabajador === filtros.trabajador); 
    }
    if (filtros.estado) {
      prestamosTemp = prestamosTemp.filter(p => p.estado === filtros.estado);
    }
    this.prestamosFiltrados = prestamosTemp;
  }

  verDetalles(id: string): void {
    this.router.navigate(['/detalle-prestamo', id]);
  }

  editarPrestamo(id: string): void {
    this.router.navigate(['/editar-prestamo', id]);
  }

  esObjetoTrabajador(trabajador: any): trabajador is Trabajador {
    return typeof trabajador === 'object' && trabajador !== null && 'nombre' in trabajador;
  }

  editarPrestamos(id: string) {
    this.router.navigate(['/editar-prestamo', id]);
  }

  eliminarPrestamo(id: string): void {
    const confirmacion = confirm('¿Estás seguro de querer eliminar este préstamo?');
    if (confirmacion) {
      this.prestamoService.eliminarPrestamo(id).subscribe({
        next: () => {
          this.cargarPrestamos();
        },
        error: (e) => console.error(e)
      });
    }
  }

  cargarPrestamos(): void {
    this.prestamoService.getPrestamos().subscribe(data => {
      this.prestamos = data;
      this.prestamosFiltrados = data; 
    }, error => {
      console.error('Error al cargar los préstamos', error);
    });
  }

  pagarCuota(prestamo: Prestamo) {
    if (prestamo._id && prestamo.cuotaActual < prestamo.cuotas) {
      prestamo.cuotaActual += 1;
  
      if (prestamo.cuotaActual === prestamo.cuotas) {
        prestamo.estado = 'Finalizado';
      }
  
      this.prestamoService.editarPrestamo(prestamo._id, prestamo).subscribe({
        next: (response) => {
          this.cargarPrestamos();
        },
        error: (error) => {
          console.error('Error al actualizar el préstamo', error);
        }
      });
    } else {
      console.error('El ID del préstamo no está definido');
    }
  }
}
