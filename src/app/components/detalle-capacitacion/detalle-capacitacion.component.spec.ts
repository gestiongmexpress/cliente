import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCapacitacionComponent } from './detalle-capacitacion.component';

describe('DetalleCapacitacionComponent', () => {
  let component: DetalleCapacitacionComponent;
  let fixture: ComponentFixture<DetalleCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleCapacitacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
