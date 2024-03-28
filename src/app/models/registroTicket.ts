import { Empresa } from "./empresa";

export interface RegistroTicket {
  _id?: string;
  fecha: Date;
  empresa: Empresa | string;
  ordenCompra: 'Si' | 'No';
  talonarios: number;
  unidades: number;
  total: number;
  folioInicial: number;
  folioFinal: number;
  estado: string;
  fechaCaducidad: Date;
  vigencia?: string;
  facturado: 'Si' | 'No';
  mesFactura?: string;
  factura?: number;
  valor: number;
  totalNeto: number;
  totalFactura: number;
  observacion?: string;
  facturacion?: string;
  ano?: number;
}