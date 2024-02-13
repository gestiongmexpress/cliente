import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMantencionesComponent } from './listar-mantenciones.component';

describe('ListarMantencionesComponent', () => {
  let component: ListarMantencionesComponent;
  let fixture: ComponentFixture<ListarMantencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarMantencionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarMantencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
