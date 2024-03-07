import { Trabajador } from "./trabajador";

export interface Prestamo {
  _id?: string; 
  trabajador: Trabajador | string; 
  monto: number;
  cuotas: number;
  cuotaMensual: number;
  fechaInicio: Date | string; 
  estado: string;
  cuotaActual: number;
  saldo: number;
  quincena: boolean;
  descripcion?: string;
}