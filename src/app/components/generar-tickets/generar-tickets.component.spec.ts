import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarTicketsComponent } from './generar-tickets.component';

describe('GenerarTicketsComponent', () => {
  let component: GenerarTicketsComponent;
  let fixture: ComponentFixture<GenerarTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerarTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerarTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
