export interface Empresa {
    _id?: string;
    nombre: string;
    rut: string;
    vigente: 'Si' | 'No';
    ordenCompra: 'Si' | 'No';
    colorFondoAsignado?: string;
    colorLetraAsignado?: string;
    valorNeto: number;
    servicioNegociado: string;
    coloresTraspasadosASucursal?: string;
    facturacion: string;
}