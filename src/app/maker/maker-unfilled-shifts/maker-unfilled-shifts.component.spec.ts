import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerUnfilledShiftsComponent } from './maker-unfilled-shifts.component';

describe('MakerUnfilledShiftsComponent', () => {
  let component: MakerUnfilledShiftsComponent;
  let fixture: ComponentFixture<MakerUnfilledShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerUnfilledShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerUnfilledShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
