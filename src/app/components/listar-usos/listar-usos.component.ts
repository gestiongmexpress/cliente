import { Component, OnInit } from '@angular/core';
import { UsoTicketService } from '../../services/usoTicket.service';
import { UsoTicket } from '../../models/usoTicket';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-listar-usos',
  templateUrl: './listar-usos.component.html',
  styleUrls: ['./listar-usos.component.css']
})
export class ListarUsosComponent implements OnInit {
  usosTickets: UsoTicket[] = [];
  usosFiltrados: UsoTicket[] = [];
  empresas: Empresa[] = [];
  filtroForm: FormGroup;
  servicios = ['Canje', 'Tradicional', 'Transportado'];
  formatDate = this.dateFormatService.formatDate.bind(this.dateFormatService);

  constructor(private usoTicketService: UsoTicketService,
              private empresaService: EmpresaService,
              private fb: FormBuilder,
              public dateFormatService: DateFormatService) {
                this.filtroForm = this.fb.group({
                  empresa: [''],
                  servicio: [''],
                  fechaInicio: [new Date(new Date().setDate(new Date().getDate() - 30))],
                  fechaFin: [new Date()]
                });
              }

  ngOnInit(): void {
      this.cargarEmpresas();
      this.cargarUsosTickets();
      this.filtroForm.valueChanges.subscribe(filtros => {
        this.filtrarUsos();
    });
  }

  cargarUsosTickets(): void {
    this.usoTicketService.obtenerTodosLosUsosTickets().subscribe({
      next: (usos) => {
        this.usosTickets = usos;
        this.usosFiltrados = usos;
        this.filtrarUsos();
      },
      error: (error) => {
        console.error('Error al cargar los usos de tickets', error);
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

  getEmpresaNombre(uso: UsoTicket): string {
    if (typeof uso.empresa === 'string') {
      const empresa = this.empresas.find(e => e._id === uso.empresa);
      return empresa ? empresa.nombre : 'Nombre no disponible';
    } else {
      return uso.empresa.nombre;
    }
  }

  filtrarUsos(): void {
    const { empresa, servicio, fechaInicio, fechaFin } = this.filtroForm.value;
    this.usosFiltrados = this.usosTickets.filter(uso => {
      const fecha = new Date(uso.fecha);
      return (
        (empresa ? uso.empresa === empresa : true) &&
        (servicio ? uso.servicio === servicio : true) &&
        (!fechaInicio || fecha >= fechaInicio) &&
        (!fechaFin || fecha <= fechaFin)
      );
    });
  }
}