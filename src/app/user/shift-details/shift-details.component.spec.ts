import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftDetailsComponent } from './shift-details.component';

describe('ShiftDetailsComponent', () => {
  let component: ShiftDetailsComponent;
  let fixture: ComponentFixture<ShiftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
