import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMantencionComponent } from './crear-mantencion.component';

describe('CrearMantencionComponent', () => {
  let component: CrearMantencionComponent;
  let fixture: ComponentFixture<CrearMantencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearMantencionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearMantencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
