import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubCatagoryComponent } from './admin-sub-catagory.component';

describe('AdminSubCatagoryComponent', () => {
  let component: AdminSubCatagoryComponent;
  let fixture: ComponentFixture<AdminSubCatagoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubCatagoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSubCatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
