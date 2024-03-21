import { Empresa } from "./empresa";

export interface RegistroPerdida {
  _id?: string;
  fecha: Date;
  empresa: Empresa | string;
  cantidad: number;
  estado: 'Perdidos' | 'Encontrados';
  ano: number;
  observacion?: string;
}