import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellrtMyproductComponent } from './sellrt-myproduct.component';

describe('SellrtMyproductComponent', () => {
  let component: SellrtMyproductComponent;
  let fixture: ComponentFixture<SellrtMyproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellrtMyproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellrtMyproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
