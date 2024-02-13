import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlagaComponent } from './crear-plaga.component';

describe('CrearPlagaComponent', () => {
  let component: CrearPlagaComponent;
  let fixture: ComponentFixture<CrearPlagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearPlagaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearPlagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
