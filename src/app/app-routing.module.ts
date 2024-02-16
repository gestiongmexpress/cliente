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


const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'inicio', component: InicioComponent}, 
  { path: 'listar-usuarios', component: ListarUsuariosComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-trabajadores', component: ListarTrabajadoresComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'listar-capacitacion', component: ListarCapacitacionesComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'] }},
  { path: 'listar-mantencion', component: ListarMantencionesComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Enc. Logistica'] }},
  { path: 'listar-plagas', component: ListarPlagasComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista'] }},
  { path: 'crear-capacitacion', component : CrearCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica'] }},
  { path: 'crear-mantencion', component : CrearMantencionComponent, canActivate: [AuthGuard]},
  { path: 'crear-plaga', component : CrearPlagaComponent, canActivate: [AuthGuard]},
  { path: 'crear-trabajador', component : CrearTrabajadorComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'editar-usuario/:id', component : RegistroComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador']}},
  { path: 'editar-capacitacion/:id', component : CrearCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica']}},
  { path: 'editar-mantencion/:id', component : CrearMantencionComponent, canActivate: [AuthGuard]},
  { path: 'editar-plaga/:id', component : CrearPlagaComponent, canActivate: [AuthGuard]},
  { path: 'detalle-capacitacion/:id', component: DetalleCapacitacionComponent, canActivate: [AuthGuard], data: { roles: ['Gerente', 'Administrador', 'Nutricionista', 'APR', 'Enc. Logistica']}},
  { path: 'detalle-mantencion/:id', component: DetalleMantencionComponent, canActivate: [AuthGuard]},
  { path: 'detalle-plaga/:id', component: DetallePlagaComponent, canActivate: [AuthGuard]},
  { path: 'registrar', component: RegistroComponent, canActivate: [AuthGuard], data: { roles: ['Administrador', 'Gerente'] } },
  { path: '**', redirectTo: '', pathMatch: 'full'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }