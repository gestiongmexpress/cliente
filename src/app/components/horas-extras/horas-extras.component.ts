import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { TrabajadorService } from '../../services/trabajador.service';
import { Asistencia } from '../../models/asistencia';
import { Trabajador } from '../../models/trabajador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrl: './horas-extras.component.css'
})
export class HorasExtrasComponent {

}