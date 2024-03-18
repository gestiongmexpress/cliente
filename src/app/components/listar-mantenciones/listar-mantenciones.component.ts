import { Component, HostListener, OnInit } from '@angular/core';
import { Mantencion } from '../../models/mantencion';
import { MantencionService } from '../../services/mantencion.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface MantencionAgrupada {
  [mes: string]: { estado: string, id: string | undefined };
}

interface AgrupacionMantenciones {
  [clave: string]: {
    detalle: Mantencion,
    porMes: MantencionAgrupada
  };
}

@Component({
  selector: 'app-listar-mantenciones',
  templateUrl: './listar-mantenciones.component.html',
  styleUrls: ['./listar-mantenciones.component.css']
})
export class ListarMantencionesComponent implements OnInit {
  mantenciones: Mantencion[] = [];
  agrupaciones: AgrupacionMantenciones = {};
  mantencionesPorMes: { [mes: string]: { realizadas: number, faltantes: number } } = {};
  estadisticasPorMes: { [mes: string]: { realizadas: number; faltantes: number } } = {};
  filtroSucursal: string = 'Central Corporativa';
  filtroAno: string = new Date().getFullYear().toString();
  filtroArea: string = 'Infraestructura/Producción'; 
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

  constructor(private mantencionService: MantencionService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucursal']) {
        this.filtroSucursal = params['sucursal'];
      }
      if (params['ano']) {
        this.filtroAno = params['ano'];
      }
      if (params['area']) {
        this.filtroArea = params['area'];
      }
      this.obtenerMantenciones();
      this.aplicarFiltro();
      });
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
  
  obtenerMantenciones() {
    this.mantencionService.getMantenciones().subscribe(data => {
      this.mantenciones = data;
      this.aplicarFiltro(); 
    }, error => {
      console.error('Error al obtener las mantenciones', error);
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
    const mantencionesFiltradas = this.mantenciones.filter(mantencion =>
      (!this.filtroSucursal || mantencion.sucursal === this.filtroSucursal) &&
      (!this.filtroAno || mantencion.ano.toString() === this.filtroAno) &&
      (!this.filtroArea || mantencion.area === this.filtroArea)
    );
  
    // Agrupar mantenciones
    this.agrupaciones = mantencionesFiltradas.reduce((acc, mantencion) => {
      if (!mantencion.mes || !mantencion.estado || !mantencion._id) {
        console.error('La mantencion no tiene mes, estado o ID definido:', mantencion);
        return acc;
      }
  
      const mesCompleto = this.mesesMap[mantencion.mes] || mantencion.mes;
      const clave = `${mantencion.nombre}-${mantencion.sucursal}-${mantencion.ano}-${mantencion.observacion}-${mantencion.codigo}`;
  
      if (!acc[clave]) {
        acc[clave] = {
          detalle: mantencion,
          porMes: {}
        };
  
        this.meses.forEach(mes => {
          acc[clave].porMes[this.mesesMap[mes] || mes] = { estado: 'bg-gray', id: undefined };
        });
      }
  
      acc[clave].porMes[mesCompleto] = {
        estado: mantencion.estado === 'Realizado' ? 'bg-success' : 'bg-danger',
        id: mantencion._id
      };
  
      return acc;
    }, {} as AgrupacionMantenciones);
  
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

  existeMantencionMes(mantenciones: MantencionAgrupada, mes: string): boolean {
    return !!mantenciones[mes] && !!mantenciones[mes].id;
  }

  obtenerIdMantencionMes(mantenciones: MantencionAgrupada, mes: string): string | undefined {
    return mantenciones[mes]?.id;
  }

  esMantencionRealizada(mantenciones: MantencionAgrupada, mes: string): boolean {
    return mantenciones[mes]?.estado === 'bg-success';
  }

  obtenerEstadoMantencion(mantenciones: MantencionAgrupada, mes: string): string {
    const estado = mantenciones[mes]?.estado;
    if (estado === 'bg-success') {
      return 'Realizado';
    } else if (estado === 'bg-danger') {
      return 'Pendiente';
    } else {
      return 'Sin datos';
    }
  }

  getTotalRealizadas(): number {
    return this.mantenciones.filter(c => c.estado === 'Realizado').length;
  }
  
  getTotalPendientes(): number {
    return this.mantenciones.filter(c => c.estado !== 'Realizado').length;
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