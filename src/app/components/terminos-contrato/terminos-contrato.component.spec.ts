import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosContratoComponent } from './terminos-contrato.component';

describe('TerminosContratoComponent', () => {
  let component: TerminosContratoComponent;
  let fixture: ComponentFixture<TerminosContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminosContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerminosContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
