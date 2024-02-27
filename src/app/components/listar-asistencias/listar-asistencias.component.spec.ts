import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsistenciasComponent } from './listar-asistencias.component';

describe('ListarAsistenciasComponent', () => {
  let component: ListarAsistenciasComponent;
  let fixture: ComponentFixture<ListarAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarAsistenciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
