import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionTicketsComponent } from './administracion-tickets.component';

describe('AdministracionTicketsComponent', () => {
  let component: AdministracionTicketsComponent;
  let fixture: ComponentFixture<AdministracionTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministracionTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministracionTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
