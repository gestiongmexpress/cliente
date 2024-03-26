import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraccionarTalonariosComponent } from './fraccionar-talonarios.component';

describe('FraccionarTalonariosComponent', () => {
  let component: FraccionarTalonariosComponent;
  let fixture: ComponentFixture<FraccionarTalonariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FraccionarTalonariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FraccionarTalonariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
