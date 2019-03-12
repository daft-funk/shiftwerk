import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerScheduleComponent } from './maker-schedule.component';

describe('MakerScheduleComponent', () => {
  let component: MakerScheduleComponent;
  let fixture: ComponentFixture<MakerScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
