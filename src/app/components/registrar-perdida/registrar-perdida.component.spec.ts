import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPerdidaComponent } from './registrar-perdida.component';

describe('RegistrarPerdidaComponent', () => {
  let component: RegistrarPerdidaComponent;
  let fixture: ComponentFixture<RegistrarPerdidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarPerdidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarPerdidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
