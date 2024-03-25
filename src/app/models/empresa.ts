export interface Empresa {
    _id?: string;
    nombre: string;
    rut: string;
    vigente: 'Si' | 'No';
    ordenCompra: 'Si' | 'No';
    colorFondoAsignado?: string | null;
    colorLetraAsignado?: string | null;
    valorNeto: number;
    valorAnterior?: number;
    servicioNegociado: 'Básico' | 'Estándar A' | 'Estándar B' | 'Clásico' | 'Ejecutivo';
    tipoServicio: 'Tradicional' | 'Transportado' | 'GM Service';
    contenedorVidrio?: 'Si' | 'No' | null;
    sucursal: string;
    coloresTraspasadosA?: string | null;
    facturacion: string;
}