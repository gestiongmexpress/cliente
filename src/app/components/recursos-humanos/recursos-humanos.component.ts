import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos-humanos.component.html',
  styleUrls: ['./recursos-humanos.component.css']
})
export class RecursosHumanosComponent implements OnInit {
  mostrarRegistro: boolean = true;
  mostrarListarTrabajadores: boolean = true;
  mostrarListarAsistencia: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
}