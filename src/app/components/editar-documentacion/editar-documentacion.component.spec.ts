import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDocumentacionComponent } from './editar-documentacion.component';

describe('EditarDocumentacionComponent', () => {
  let component: EditarDocumentacionComponent;
  let fixture: ComponentFixture<EditarDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarDocumentacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
