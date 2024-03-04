import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarCapacitacionesComponent } from './components/listar-capacitaciones/listar-capacitaciones.component';
import { CrearCapacitacionComponent } from './components/crear-capacitacion/crear-capacitacion.component';
import { DetalleCapacitacionComponent } from './components/detalle-capacitacion/detalle-capacitacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListarUsuariosComponent } from './components/listar-usuarios/listar-usuarios.component';
import { CrearMantencionComponent } from './components/crear-mantencion/crear-mantencion.component';
import { ListarMantencionesComponent } from './components/listar-mantenciones/listar-mantenciones.component';
import { DetalleMantencionComponent } from './components/detalle-mantencion/detalle-mantencion.component';
import { CrearPlagaComponent } from './components/crear-plaga/crear-plaga.component';
import { ListarPlagasComponent } from './components/listar-plagas/listar-plagas.component';
import { DetallePlagaComponent } from './components/detalle-plaga/detalle-plaga.component';
import { CrearTrabajadorComponent } from './components/crear-trabajador/crear-trabajador.component';
import { ListarTrabajadoresComponent } from './components/listar-trabajadores/listar-trabajadores.component';
import { DetalleTrabajadorComponent } from './components/detalle-trabajador/detalle-trabajador.component';
import { CumplesComponent } from './components/cumples/cumples.component';
import { TerminosContratoComponent } from './components/terminos-contrato/terminos-contrato.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { EditarDocumentacionComponent } from './components/editar-documentacion/editar-documentacion.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { CrearPrestamoComponent } from './components/crear-prestamo/crear-prestamo.component';
import { ListarPrestamosComponent } from './components/listar-prestamos/listar-prestamos.component';
import { ListarAsistenciasComponent } from './components/listar-asistencias/listar-asistencias.component';
import { RecursosHumanosComponent } from './components/recursos-humanos/recursos-humanos.component';
import { CrearAsistenciaComponent } from './components/crear-asistencia/crear-asistencia.component';
import { HorasExtrasComponent } from './components/horas-extras/horas-extras.component';
import { PermisoComponent } from './components/permiso/permiso.component';


const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'inicio', component: InicioComponent}, 
  { path: 'listar-usuarios', component: ListarUsuariosComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-trabajadores', component: ListarTrabajadoresComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-capacitacion', component: ListarCapacitacionesComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'] }},
  { path: 'listar-mantencion', component: ListarMantencionesComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Enc. Logistica'] }},
  { path: 'listar-plagas', component: ListarPlagasComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista'] }},
  { path: 'listar-cumples', component: CumplesComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-prestamos', component: ListarPrestamosComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-asistencias', component: ListarAsistenciasComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'crear-capacitacion', component : CrearCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'] }},
  { path: 'crear-asistencia', component: CrearAsistenciaComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'crear-mantencion', component : CrearMantencionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Enc. Logistica'] }},
  { path: 'crear-plaga', component : CrearPlagaComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista'] }},
  { path: 'crear-trabajador', component : CrearTrabajadorComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'editar-usuario/:id', component : RegistroComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'editar-trabajador/:id', component : CrearTrabajadorComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'editar-capacitacion/:id', component : CrearCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica']}},
  { path: 'editar-mantencion/:id', component : CrearMantencionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Enc. Logistica'] }},
  { path: 'editar-prestamo/:id', component: CrearPrestamoComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'editar-plaga/:id', component : CrearPlagaComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista'] }},
  { path: 'editar-documentacion/:id', component: EditarDocumentacionComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'detalle-capacitacion/:id', component: DetalleCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica']}},
  { path: 'detalle-mantencion/:id', component: DetalleMantencionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Enc. Logistica'] }},
  { path: 'detalle-trabajador/:id', component: DetalleTrabajadorComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'detalle-plaga/:id', component: DetallePlagaComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista'] }},
  { path: 'registrar', component: RegistroComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'auditoria', component: AuditoriaComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'termino-contrato', component: TerminosContratoComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'horarios', component: HorariosComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'crear-prestamo', component: CrearPrestamoComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'recursos-humanos', component: RecursosHumanosComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'horasExtra', component: HorasExtrasComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: 'permisos', component: PermisoComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente']}},
  { path: '**', redirectTo: '', pathMatch: 'full'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }