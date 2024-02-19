import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTrabajadorComponent } from './detalle-trabajador.component';

describe('DetalleTrabajadorComponent', () => {
  let component: DetalleTrabajadorComponent;
  let fixture: ComponentFixture<DetalleTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
