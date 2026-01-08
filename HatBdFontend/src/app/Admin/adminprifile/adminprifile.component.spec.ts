import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminprifileComponent } from './adminprifile.component';

describe('AdminprifileComponent', () => {
  let component: AdminprifileComponent;
  let fixture: ComponentFixture<AdminprifileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminprifileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminprifileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
