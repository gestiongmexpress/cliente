import { Empresa } from "./empresa";

export interface UsoTicket {
  _id?: string;
  fecha: Date;
  cantidad: number;
  empresa: Empresa | string;
  ticketPendiente?: string;
  cuantos?: number;
  servicio: string;
  observacion?: string;
  ano: number;
}