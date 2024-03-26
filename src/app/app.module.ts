import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UtcDatePipe } from './pipes/utc-date.pipe';
import { NombreMesPipe } from './pipes/nombre-mes.pipe';
import { NombreMesAnoPipe } from './pipes/nombreMesAno';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearCapacitacionComponent } from './components/crear-capacitacion/crear-capacitacion.component';
import { ListarCapacitacionesComponent } from './components/listar-capacitaciones/listar-capacitaciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './components/inicio/inicio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DetalleCapacitacionComponent } from './components/detalle-capacitacion/detalle-capacitacion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { CrearMantencionComponent } from './components/crear-mantencion/crear-mantencion.component';
import { ListarMantencionesComponent } from './components/listar-mantenciones/listar-mantenciones.component';
import { DetalleMantencionComponent } from './components/detalle-mantencion/detalle-mantencion.component';
import { DetallePlagaComponent } from './components/detalle-plaga/detalle-plaga.component';
import { CrearPlagaComponent } from './components/crear-plaga/crear-plaga.component';
import { ListarPlagasComponent } from './components/listar-plagas/listar-plagas.component';
import { ListarUsuariosComponent } from './components/listar-usuarios/listar-usuarios.component';
import { CrearTrabajadorComponent } from './components/crear-trabajador/crear-trabajador.component';
import { ListarTrabajadoresComponent } from './components/listar-trabajadores/listar-trabajadores.component';
import { DetalleTrabajadorComponent } from './components/detalle-trabajador/detalle-trabajador.component';
import { CumplesComponent } from './components/cumples/cumples.component';
import { TerminosContratoComponent } from './components/terminos-contrato/terminos-contrato.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { EditarDocumentacionComponent } from './components/editar-documentacion/editar-documentacion.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { ListarPrestamosComponent } from './components/listar-prestamos/listar-prestamos.component';
import { CrearPrestamoComponent } from './components/crear-prestamo/crear-prestamo.component';
import { ListarAsistenciasComponent } from './components/listar-asistencias/listar-asistencias.component';
import { RecursosHumanosComponent } from './components/recursos-humanos/recursos-humanos.component';
import { CrearAsistenciaComponent } from './components/crear-asistencia/crear-asistencia.component';
import { HorasExtrasComponent } from './components/horas-extras/horas-extras.component';
import { PermisoComponent } from './components/permiso/permiso.component';
import { CrearEmpresaComponent } from './components/crear-empresa/crear-empresa.component';
import { ListarEmpresasComponent } from './components/listar-empresas/listar-empresas.component';
import { AdministracionTicketsComponent } from './components/administracion-tickets/administracion-tickets.component';
import { ListarTicketsComponent } from './components/listar-tickets/listar-tickets.component';
import { GenerarTicketsComponent } from './components/generar-tickets/generar-tickets.component';
import { CrearTicketComponent } from './components/crear-ticket/crear-ticket.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AbonarPrestamoComponent } from './components/abonar-prestamo/abonar-prestamo.component';
import { UsoTicketComponent } from './components/uso-ticket/uso-ticket.component';
import { RegistroTicketsComponent } from './components/registro-tickets/registro-tickets.component';
import { ListarUsosComponent } from './components/listar-usos/listar-usos.component';
import { ListarPerdidasComponent } from './components/listar-perdidas/listar-perdidas.component';
import { RegistrarPerdidaComponent } from './components/registrar-perdida/registrar-perdida.component';
import { FraccionarTalonariosComponent } from './components/fraccionar-talonarios/fraccionar-talonarios.component';

@NgModule({
  declarations: [
    AppComponent,
    UtcDatePipe,
    NombreMesPipe,
    NombreMesAnoPipe,
    CrearCapacitacionComponent,
    ListarCapacitacionesComponent,
    InicioComponent,
    DetalleCapacitacionComponent,
    RegistroComponent,
    LoginComponent,
    CrearMantencionComponent,
    ListarMantencionesComponent,
    DetalleMantencionComponent,
    DetallePlagaComponent,
    CrearPlagaComponent,
    ListarPlagasComponent,
    ListarUsuariosComponent,
    CrearTrabajadorComponent,
    ListarTrabajadoresComponent,
    DetalleTrabajadorComponent,
    CumplesComponent,
    TerminosContratoComponent,
    HorariosComponent,
    EditarDocumentacionComponent,
    AuditoriaComponent,
    ListarPrestamosComponent,
    CrearPrestamoComponent,
    ListarAsistenciasComponent,
    RecursosHumanosComponent,
    CrearAsistenciaComponent,
    HorasExtrasComponent,
    PermisoComponent,
    CrearEmpresaComponent,
    ListarEmpresasComponent,
    AdministracionTicketsComponent,
    ListarTicketsComponent,
    GenerarTicketsComponent,
    CrearTicketComponent,
    LayoutComponent,
    AbonarPrestamoComponent,
    UsoTicketComponent,
    RegistroTicketsComponent,
    ListarUsosComponent,
    ListarPerdidasComponent,
    RegistrarPerdidaComponent,
    FraccionarTalonariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
