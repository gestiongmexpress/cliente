import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumplesComponent } from './cumples.component';

describe('CumplesComponent', () => {
  let component: CumplesComponent;
  let fixture: ComponentFixture<CumplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CumplesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CumplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
