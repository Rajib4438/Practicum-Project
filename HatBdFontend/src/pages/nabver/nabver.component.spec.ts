import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NabverComponent } from './nabver.component';

describe('NabverComponent', () => {
  let component: NabverComponent;
  let fixture: ComponentFixture<NabverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NabverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NabverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
