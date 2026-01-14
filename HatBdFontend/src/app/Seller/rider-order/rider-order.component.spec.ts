import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderOrderComponent } from './rider-order.component';

describe('RiderOrderComponent', () => {
  let component: RiderOrderComponent;
  let fixture: ComponentFixture<RiderOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiderOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
