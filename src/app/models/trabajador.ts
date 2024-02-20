export class Trabajador {
    _id?: string;
    nombre: string;
    rut: string;
    fechaNacimiento: Date;
    estadoEmpresa: string;
    celular?: number;
    estadoCivil?: string;
    domicilio?: string;
    sector?: string;
    ciudad?: string;
    empresaContrata?: string;
    tipoContrato?: string;
    plazoContrato?: string;
    fechaInicioContrato?: Date;
    fechaTerminoContrato?: Date;
    cargo?: string;
    area?: string;
    sucursal?: string;
    direccionProyecto?: string;
    numeroContrato?: string;
    licenciaConducir?: string;
    claseLicencia?: string;
    nacionalidad?: string;
    banco?: string;
    tipoCuenta?: string;
    numeroCuenta?: number;
    correoElectronico?: string;
    calzado?: number;
    tallaCamisa?: string;
    tallaPantalon?: string;
    afp?: string;
    fechaIncorporacionAFP?: Date;
    institucionSalud?: string;
    entregaRopaTrabajo?: string;
    contactoEmergencia?: {
        nombre?: string;
        parentesco?: string;
        telefono?: number;
    };
    fechaFiniquito?: Date;
    causaFiniquito?: string;
    escalaRecomendacion?: number;
    sueldoBase?: number;
    fechaActualizacionOferta?: Date;
    diasVacaciones?: number;
    horarioEntrada?: string;
    horarioSalida?: string

    constructor(
        nombre: string,
        rut: string,
        fechaNacimiento: Date,
        estadoEmpresa: string,
        celular?: number,
        estadoCivil?: string,
        domicilio?: string,
        sector?: string,
        ciudad?: string,
        empresaContrata?: string,
        tipoContrato?: string,
        plazoContrato?: string,
        fechaInicioContrato?: Date,
        fechaTerminoContrato?: Date,
        cargo?: string,
        area?: string,
        sucursal?: string,
        direccionProyecto?: string,
        numeroContrato?: string,
        licenciaConducir?: string,
        claseLicencia?: string,
        nacionalidad?: string,
        banco?: string,
        tipoCuenta?: string,
        numeroCuenta?: number,
        correoElectronico?: string,
        calzado?: number,
        tallaCamisa?: string,
        tallaPantalon?: string,
        afp?: string,
        fechaIncorporacionAFP?: Date,
        institucionSalud?: string,
        entregaRopaTrabajo?: string,
        contactoEmergencia?: {
            nombre?: string;
            parentesco?: string;
            telefono?: number;
        },
        fechaFiniquito?: Date,
        causaFiniquito?: string,
        escalaRecomendacion?: number,
        sueldoBase?: number,
        fechaActualizacionOferta?: Date,
        diasVacaciones?: number,
        horarioEntrada?: string,
        horarioSalida?: string
    ) {
        this.nombre = nombre;
        this.rut = rut;
        this.fechaNacimiento = fechaNacimiento;
        this.celular = celular;
        this.estadoEmpresa = estadoEmpresa;
        this.estadoCivil = estadoCivil;
        this.domicilio = domicilio;
        this.sector = sector;
        this.ciudad = ciudad;
        this.empresaContrata = empresaContrata;
        this.tipoContrato = tipoContrato;
        this.plazoContrato = plazoContrato;
        this.fechaInicioContrato = fechaInicioContrato;
        this.fechaTerminoContrato = fechaTerminoContrato;
        this.cargo = cargo;
        this.area = area;
        this.sucursal = sucursal;
        this.direccionProyecto = direccionProyecto;
        this.numeroContrato = numeroContrato;
        this.licenciaConducir = licenciaConducir;
        this.claseLicencia = claseLicencia;
        this.nacionalidad = nacionalidad;
        this.banco = banco;
        this.tipoCuenta = tipoCuenta;
        this.numeroCuenta = numeroCuenta;
        this.correoElectronico = correoElectronico;
        this.calzado = calzado;
        this.tallaCamisa = tallaCamisa;
        this.tallaPantalon = tallaPantalon;
        this.afp = afp;
        this.fechaIncorporacionAFP = fechaIncorporacionAFP;
        this.institucionSalud = institucionSalud;
        this.entregaRopaTrabajo = entregaRopaTrabajo;
        this.contactoEmergencia = contactoEmergencia;
        this.fechaFiniquito = fechaFiniquito;
        this.causaFiniquito = causaFiniquito;
        this.escalaRecomendacion = escalaRecomendacion;
        this.sueldoBase = sueldoBase;
        this.fechaActualizacionOferta = fechaActualizacionOferta;
        this.diasVacaciones = diasVacaciones;
        this.horarioEntrada = horarioEntrada;
        this.horarioSalida = horarioSalida;
    }
}