import { Component, HostListener, OnInit } from '@angular/core';
import { Plaga } from '../../models/plaga';
import { PlagaService } from '../../services/plaga.service';
import { ChangeDetectorRef } from '@angular/core';

interface PlagaAgrupada {
  [mes: string]: { estado: string, id: string | undefined };
}

interface AgrupacionPlagas {
  [clave: string]: {
    detalle: Plaga,
    porMes: PlagaAgrupada
  };
}

@Component({
  selector: 'app-listar-plagas',
  templateUrl: './listar-plagas.component.html',
  styleUrls: ['./listar-plagas.component.css']
})
export class ListarPlagasComponent implements OnInit {
  plagas: Plaga[] = [];
  agrupaciones: AgrupacionPlagas = {};
  plagasPorMes: { [mes: string]: { realizadas: number, faltantes: number } } = {};
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

  constructor(private plagaService: PlagaService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerPlagas();
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
  
  obtenerPlagas() {
    this.plagaService.getPlagas().subscribe(data => {
      this.plagas = data;
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
    const plagasFiltradas = this.plagas.filter(plaga =>
      (!this.filtroSucursal || plaga.sucursal === this.filtroSucursal) &&
      (!this.filtroAno || plaga.ano.toString() === this.filtroAno) 
    );
  
    // Agrupar capacitaciones
    this.agrupaciones = plagasFiltradas.reduce((acc, plaga) => {
      if (!plaga.mes || !plaga.estado || !plaga._id) {
        console.error('El control de plaga no tiene mes, estado o ID definido:', plaga);
        return acc;
      }
  
      const mesCompleto = this.mesesMap[plaga.mes] || plaga.mes;
      const clave = `${plaga.nombre}-${plaga.encargado}-${plaga.ano}`;
  
      if (!acc[clave]) {
        acc[clave] = {
          detalle: plaga,
          porMes: {}
        };
  
        this.meses.forEach(mes => {
          acc[clave].porMes[this.mesesMap[mes] || mes] = { estado: 'bg-gray', id: undefined };
        });
      }
  
      acc[clave].porMes[mesCompleto] = {
        estado: plaga.estado === 'Realizado' ? 'bg-success' : 'bg-danger',
        id: plaga._id
      };
  
      return acc;
    }, {} as AgrupacionPlagas);
  
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

  existePlagaMes(plagas: PlagaAgrupada, mes: string): boolean {
    return !!plagas[mes] && !!plagas[mes].id;
  }

  obtenerIdPlagaMes(plagas: PlagaAgrupada, mes: string): string | undefined {
    return plagas[mes]?.id;
  }

  esMantencionRealizada(mantenciones: PlagaAgrupada, mes: string): boolean {
    return mantenciones[mes]?.estado === 'bg-success';
  }

  // Función para obtener el estado de la mantencion para visualización
  obtenerEstadoMantencion(mantenciones: PlagaAgrupada, mes: string): string {
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
    return this.plagas.filter(c => c.estado === 'Realizado').length;
  }
  
  getTotalPendientes(): number {
    return this.plagas.filter(c => c.estado !== 'Realizado').length;
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