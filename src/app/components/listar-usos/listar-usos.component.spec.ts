import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUsosComponent } from './listar-usos.component';

describe('ListarUsosComponent', () => {
  let component: ListarUsosComponent;
  let fixture: ComponentFixture<ListarUsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarUsosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarUsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
