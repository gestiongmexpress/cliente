export class Mantencion {
    _id?: string;
    nombre: string;
    observacion: string;
    codigo: string;
    mes: string;
    ano: number;
    area: string;
    sucursal: string;
    encargado: string;
    proveedor: string;
    estado: string;
    fechaCreacion?: Date;
    fechaRealizacion?: Date;
    ultimoEditor?: string;
    rolEditor?: string;

    constructor(
        nombre: string,
        observacion: string,
        codigo: string,
        mes: string,
        ano: number,
        area: string,
        sucursal: string,
        encargado: string,
        proveedor: string,
        estado: string,
        fechaCreacion?: Date,
        fechaRealizacion?: Date,
        ultimoEditor?: string,
        rolEditor?: string
    ) {
        this.nombre = nombre;
        this.observacion = observacion;
        this.codigo = codigo;
        this.mes = mes;
        this.ano = ano;
        this.encargado = encargado;
        this.proveedor = proveedor;
        this.estado = estado;
        this.area = area;
        this.sucursal = sucursal;
        this.fechaCreacion = fechaCreacion;
        this.fechaRealizacion = fechaRealizacion;
        this.ultimoEditor = ultimoEditor;
        this.rolEditor = rolEditor;
    }
}