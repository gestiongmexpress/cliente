import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

@NgModule({
  declarations: [
    AppComponent,
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
    ListarPlagasComponent
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
