import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerShowOrderComponent } from './seller-show-order.component';

describe('SellerShowOrderComponent', () => {
  let component: SellerShowOrderComponent;
  let fixture: ComponentFixture<SellerShowOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerShowOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerShowOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
