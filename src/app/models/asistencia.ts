import { Trabajador } from "./trabajador";

export interface Asistencia {
  _id?: string;
  trabajador: Trabajador | string;
  dia: Date;
  horaEntrada?: string;
  horaSalida?: string;
  entradaReal?: string;
  salidaReal?: string;
  diferencia?: number;
  horasTotales?: string;
  horasExtras?: boolean;
  montoExtra?: string;
  permiso?: boolean;
  montoPermiso?: string;
}