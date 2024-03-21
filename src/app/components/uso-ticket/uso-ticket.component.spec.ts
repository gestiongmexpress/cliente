import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoTicketComponent } from './uso-ticket.component';

describe('UsoTicketComponent', () => {
  let component: UsoTicketComponent;
  let fixture: ComponentFixture<UsoTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsoTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsoTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
