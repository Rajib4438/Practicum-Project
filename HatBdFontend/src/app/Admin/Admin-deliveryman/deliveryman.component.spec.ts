import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverymanComponent } from './deliveryman.component';

describe('DeliverymanComponent', () => {
  let component: DeliverymanComponent;
  let fixture: ComponentFixture<DeliverymanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverymanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliverymanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
