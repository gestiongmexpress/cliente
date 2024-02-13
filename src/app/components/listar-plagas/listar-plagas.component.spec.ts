import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlagasComponent } from './listar-plagas.component';

describe('ListarPlagasComponent', () => {
  let component: ListarPlagasComponent;
  let fixture: ComponentFixture<ListarPlagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPlagasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPlagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
