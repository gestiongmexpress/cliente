import { Component, HostListener, OnInit } from '@angular/core';
import { Capacitacion } from '../../models/capacitacion';
import { CapacitacionService } from '../../services/capacitacion.service';
import { ChangeDetectorRef } from '@angular/core';

interface CapacitacionAgrupada {
  [mes: string]: { estado: string, id: string | undefined };
}

interface AgrupacionCapacitaciones {
  [clave: string]: {
    detalle: Capacitacion,
    porMes: CapacitacionAgrupada
  };
}

@Component({
  selector: 'app-listar-capacitaciones',
  templateUrl: './listar-capacitaciones.component.html',
  styleUrls: ['./listar-capacitaciones.component.css']
})
export class ListarCapacitacionesComponent implements OnInit {
  capacitaciones: Capacitacion[] = [];
  agrupaciones: AgrupacionCapacitaciones = {};
  capacitacionesPorMes: { [mes: string]: { realizadas: number, faltantes: number } } = {};
  estadisticasPorMes: { [mes: string]: { realizadas: number; faltantes: number } } = {};
  filtroSucursal: string = 'Central Corporativa';
  filtroAno: string = new Date().getFullYear().toString();
  showScrollToTopButton: boolean = false;
  showScrollToBottomButton: boolean = false;
  totalRealizadas: number = 0;
  totalFaltantes: number = 0;
  rolUsuario: string = '';
  meses: string[] = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  mesesMap: { [key: string]: string } = {
    'ENE': 'Enero',
    'FEB': 'Febrero',
    'MAR': 'Marzo',
    'ABR': 'Abril',
    'MAY': 'Mayo',
    'JUN': 'Junio',
    'JUL': 'Julio',
    'AGO': 'Agosto',
    'SEP': 'Septiembre',
    'OCT': 'Octubre',
    'NOV': 'Noviembre',
    'DIC': 'Diciembre'
  };

  constructor(private capacitacionService: CapacitacionService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerCapacitaciones();
    this.aplicarFiltro();
    this.obtenerRolUsuario();
  }
  obtenerRolUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      this.rolUsuario = decodedPayload.rol;
  }
  }
  
  obtenerCapacitaciones() {
    this.capacitacionService.getCapacitaciones().subscribe(data => {
      this.capacitaciones = data;
      this.aplicarFiltro(); 
    }, error => {
      console.error('Error al obtener las capacitaciones', error);
    });
  }

  aplicarFiltro() {
    // Reiniciar las estadísticas generales y por mes
    this.totalRealizadas = 0;
    this.totalFaltantes = 0;
    this.estadisticasPorMes = {};
  
    // Inicializar estadísticas por mes
    this.meses.forEach(mes => {
      this.estadisticasPorMes[this.mesesMap[mes] || mes] = { realizadas: 0, faltantes: 0 };
    });
  
    // Filtrar capacitaciones según los filtros aplicados
    const capacitacionesFiltradas = this.capacitaciones.filter(capacitacion =>
      (!this.filtroSucursal || capacitacion.sucursal === this.filtroSucursal) &&
      (!this.filtroAno || capacitacion.ano.toString() === this.filtroAno)
    );
  
    // Agrupar capacitaciones
    this.agrupaciones = capacitacionesFiltradas.reduce((acc, capacitacion) => {
      if (!capacitacion.mes || !capacitacion.estado || !capacitacion._id) {
        console.error('La capacitación no tiene mes, estado o ID definido:', capacitacion);
        return acc;
      }
  
      const mesCompleto = this.mesesMap[capacitacion.mes] || capacitacion.mes;
      const clave = `${capacitacion.nombreCapacitacion}-${capacitacion.encargado}-${capacitacion.ano}`;
  
      if (!acc[clave]) {
        acc[clave] = {
          detalle: capacitacion,
          porMes: {}
        };
  
        this.meses.forEach(mes => {
          acc[clave].porMes[this.mesesMap[mes] || mes] = { estado: 'bg-gray', id: undefined };
        });
      }
  
      acc[clave].porMes[mesCompleto] = {
        estado: capacitacion.estado === 'Realizado' ? 'bg-success' : 'bg-danger',
        id: capacitacion._id
      };
  
      return acc;
    }, {} as AgrupacionCapacitaciones);
  
    // Calcular estadísticas generales y por mes
    Object.values(this.agrupaciones).forEach(agrupacion => {
      this.meses.forEach(mes => {
        const mesCompleto = this.mesesMap[mes] || mes;
        if (agrupacion.porMes[mesCompleto].id) {
          if (agrupacion.porMes[mesCompleto].estado === 'bg-success') {
            this.totalRealizadas++;
            this.estadisticasPorMes[mesCompleto].realizadas++;
          } else if (agrupacion.porMes[mesCompleto].estado === 'bg-danger') {
            this.totalFaltantes++;
            this.estadisticasPorMes[mesCompleto].faltantes++;
          }
        }
      });
    });

    this.cdRef.detectChanges();
  }
  

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  existeCapacitacionMes(capacitaciones: CapacitacionAgrupada, mes: string): boolean {
    return !!capacitaciones[mes] && !!capacitaciones[mes].id;
  }

  obtenerIdCapacitacionMes(capacitaciones: CapacitacionAgrupada, mes: string): string | undefined {
    return capacitaciones[mes]?.id;
  }

  esCapacitacionRealizada(capacitaciones: CapacitacionAgrupada, mes: string): boolean {
    return capacitaciones[mes]?.estado === 'bg-success';
  }

  // Función para obtener el estado de la capacitación para visualización
  obtenerEstadoCapacitacion(capacitaciones: CapacitacionAgrupada, mes: string): string {
    const estado = capacitaciones[mes]?.estado;
    if (estado === 'bg-success') {
      return 'Realizado';
    } else if (estado === 'bg-danger') {
      return 'Pendiente';
    } else {
      return 'Sin datos';
    }
  }

  getTotalRealizadas(): number {
    return this.capacitaciones.filter(c => c.estado === 'Realizado').length;
  }
  
  getTotalPendientes(): number {
    return this.capacitaciones.filter(c => c.estado !== 'Realizado').length;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(): void {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    const windowSize = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    this.showScrollToTopButton = scrollPosition > windowSize * 0.3;
    this.showScrollToBottomButton = bodyHeight - (scrollPosition + windowSize) > windowSize * 0.3;
  }
  
}