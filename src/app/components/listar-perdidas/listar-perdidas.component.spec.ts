import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPerdidasComponent } from './listar-perdidas.component';

describe('ListarPerdidasComponent', () => {
  let component: ListarPerdidasComponent;
  let fixture: ComponentFixture<ListarPerdidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPerdidasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPerdidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
