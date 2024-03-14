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
    fechaNoVigencia?: Date;
    razonNoVigencia?: string;
    horarioEntrada?: string;
    horarioSalida?: string;
    focotopiaCedula?: string;
    certificadoAntecedentes?: string;
    certificadoAFP?: string;
    certificadoSalud?: string;
    induccion?: string;
    perfilDeCargo?: string;
    obligacionInformacion?: string;
    recepcionReglamento?: string;
    examenRiohs?: string;
    certificadoAprobacionHigiene?: string;
    recepcionCovid?: string;
    cartaOferta?: string;
    registroRopa?: string;
    contratoFirmado?: string;
    anexoContrato?: string;
    estadoDocumentacion?: string;

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
        fechaNoVigencia?: Date,
        razonNoVigencia?: string,
        horarioEntrada?: string,
        horarioSalida?: string,
        focotopiaCedula?: string,
        certificadoAntecedentes?: string,
        certificadoAFP?: string,
        certificadoSalud?: string,
        induccion?: string,
        perfilDeCargo?: string,
        obligacionInformacion?: string,
        recepcionReglamento?: string,
        examenRiohs?: string,
        certificadoAprobacionHigiene?: string,
        recepcionCovid?: string,
        cartaOferta?: string,
        registroRopa?: string,
        contratoFirmado?: string,
        anexoContrato?: string,
        estadoDocumentacion?: string
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
        this.fechaNoVigencia = fechaNoVigencia;
        this.razonNoVigencia = razonNoVigencia;
        this.horarioEntrada = horarioEntrada;
        this.horarioSalida = horarioSalida;
        this.focotopiaCedula = focotopiaCedula;
        this.certificadoAntecedentes = certificadoAntecedentes;
        this.certificadoAFP = certificadoAFP;
        this.certificadoSalud = certificadoSalud;
        this.induccion = induccion;
        this.perfilDeCargo = perfilDeCargo;
        this.obligacionInformacion = obligacionInformacion;
        this.recepcionReglamento = recepcionReglamento;
        this.examenRiohs = examenRiohs;
        this.certificadoAprobacionHigiene = certificadoAprobacionHigiene;
        this.recepcionCovid = recepcionCovid;
        this.cartaOferta = cartaOferta;
        this.registroRopa = registroRopa;
        this.contratoFirmado = contratoFirmado;
        this.anexoContrato = anexoContrato;
        this.estadoDocumentacion = estadoDocumentacion;
    }
}