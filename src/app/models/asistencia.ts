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
  extraDiurno?: boolean;
  horasExtraDiurno?: string;
  extraTardio?: boolean;
  horasExtraTardio?: string;
  permisoDiurno?: boolean;
  horasPermisoDiurno?: string;
  permisoTardio?: boolean;
  horasPermisoTardio?: string;
}