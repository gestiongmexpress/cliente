export class Capacitacion {
    _id?: string;
    nombreCapacitacion: string; 
    encargado: string;
    mes: string;
    ano: number;
    sucursal: string;
    fechaCreacion?: Date; 
    estado: string; 
    proveedor?: string;
    asistentes?: string;
    nota?: string;
    fechaRealizacion?: Date;
    ultimoEditor?: string;
    rolEditor?: string;
    diaRealizado?: Date;

    constructor(
        nombreCapacitacion: string, 
        encargado: string, 
        sucursal: string, 
        mes: string, 
        ano: number, 
        estado: string, 
        asistentes?: string, 
        nota?: string, 
        proveedor?: string,
        fechaCreacion?: Date,
        fechaRealizacion?: Date,
        ultimoEditor?: string,
        rolEditor?: string,
        diaRealizado?: Date
    ) {
        this.nombreCapacitacion = nombreCapacitacion;
        this.encargado = encargado;
        this.sucursal = sucursal;
        this.mes = mes;
        this.ano = ano;
        this.estado = estado; 
        this.asistentes = asistentes;
        this.nota = nota;
        this.proveedor = proveedor;
        this.fechaRealizacion = fechaRealizacion;
        this.fechaCreacion = fechaCreacion;
        this.ultimoEditor = ultimoEditor;
        this.rolEditor = rolEditor;
        this.diaRealizado = diaRealizado;
    }
}