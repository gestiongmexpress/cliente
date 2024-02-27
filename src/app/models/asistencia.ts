import { Trabajador } from "./trabajador";

export interface Asistencia {
  _id?: string;
  trabajador: Trabajador | string;
  dia: Date | string;
  horaEntrada?: string;
  horaSalida?: string;
  entradaReal?: string;
  salidaReal?: string;
  diferencia?: number;
}