import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePlagaComponent } from './detalle-plaga.component';

describe('DetallePlagaComponent', () => {
  let component: DetallePlagaComponent;
  let fixture: ComponentFixture<DetallePlagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallePlagaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallePlagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
