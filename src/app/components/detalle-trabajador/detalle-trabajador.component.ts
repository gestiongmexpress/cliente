import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrabajadorService } from '../../services/trabajador.service'; 
import { Trabajador } from '../../models/trabajador'; 
import { DateFormatService } from '../../services/date-format.service';

@Component({
  selector: 'app-detalle-trabajador',
  templateUrl: './detalle-trabajador.component.html',
  styleUrls: ['./detalle-trabajador.component.css']
})
export class DetalleTrabajadorComponent implements OnInit {
  trabajador: Trabajador | undefined;
  fechaNacimientoFormateada: string | undefined;
  fechaInicioContratoFormateada: string | undefined;
  fechaTerminoContratoFormateada: string | undefined;
  fechaIncorporacionAFPFormateada: string | undefined;
  fechaFiniquitoFormateada: string | undefined;
  fechaActOfertaFormateada: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private trabajadorService: TrabajadorService,
    private dateFormatService: DateFormatService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.trabajadorService.obtenerTrabajador(id).subscribe(trabajador => {
          this.trabajador = trabajador;
          if (trabajador.fechaNacimiento) {
            this.fechaNacimientoFormateada = this.dateFormatService.formatDate(trabajador.fechaNacimiento);
          if (trabajador.fechaInicioContrato) {
              this.fechaInicioContratoFormateada = this.dateFormatService.formatDate(trabajador.fechaInicioContrato);
          } else {
              this.fechaInicioContratoFormateada = ''; 
          }
          if (trabajador.fechaTerminoContrato) {
            this.fechaTerminoContratoFormateada = this.dateFormatService.formatDate(trabajador.fechaTerminoContrato);
          } else {
            this.fechaTerminoContratoFormateada = ''; 
          }
          if (trabajador.fechaIncorporacionAFP) {
            this.fechaIncorporacionAFPFormateada = this.dateFormatService.formatDate(trabajador.fechaIncorporacionAFP);
          } else {
            this.fechaIncorporacionAFPFormateada = ''; 
          }
          if (trabajador.fechaFiniquito) {
            this.fechaFiniquitoFormateada = this.dateFormatService.formatDate(trabajador.fechaFiniquito);
          } else {
            this.fechaFiniquitoFormateada = ''; 
          }
          if (trabajador.fechaActualizacionOferta) {
            this.fechaActOfertaFormateada = this.dateFormatService.formatDate(trabajador.fechaActualizacionOferta);
          } else {
            this.fechaActOfertaFormateada = ''; 
          }
          }
        });
      }
    });
  }
  

  volver(): void {
    window.history.back(); 
  }
}
