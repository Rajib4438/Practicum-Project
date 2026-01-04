import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDashboardComponent } from './sell-dashboard.component';

describe('SellDashboardComponent', () => {
  let component: SellDashboardComponent;
  let fixture: ComponentFixture<SellDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
