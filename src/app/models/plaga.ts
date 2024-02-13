export class Plaga {
    _id?: string;
    nombre: string;
    observacion: string;
    sucursal: string;
    mes: string;
    ano: number;
    encargado: string;
    estado: string;
    fechaCreacion?: Date;
    fechaRealizacion?: Date;
    prueba?: string;
    ultimoEditor?: string;
    rolEditor?: string;

    constructor(
        nombre: string,
        observacion: string,
        sucursal: string,
        mes: string,
        ano: number,
        encargado: string,
        estado: string,
        fechaCreacion?: Date,
        fechaRealizacion?: Date,
        prueba?: string,
        ultimoEditor?: string,
        rolEditor?: string
    ) {
        this.nombre = nombre;
        this.observacion = observacion;
        this.sucursal = sucursal;
        this.mes = mes;
        this.ano = ano;
        this.encargado = encargado;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.fechaRealizacion = fechaRealizacion;
        this.prueba = prueba;
        this.ultimoEditor = ultimoEditor;
        this.rolEditor = rolEditor;
    }
}
