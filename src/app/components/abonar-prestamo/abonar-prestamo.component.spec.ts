import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonarPrestamoComponent } from './abonar-prestamo.component';

describe('AbonarPrestamoComponent', () => {
  let component: AbonarPrestamoComponent;
  let fixture: ComponentFixture<AbonarPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbonarPrestamoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbonarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
