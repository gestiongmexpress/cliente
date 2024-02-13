import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMantencionComponent } from './detalle-mantencion.component';

describe('DetalleMantencionComponent', () => {
  let component: DetalleMantencionComponent;
  let fixture: ComponentFixture<DetalleMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleMantencionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
