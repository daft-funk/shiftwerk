import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerScheduleComponent } from './werker-schedule.component';

describe('WerkerScheduleComponent', () => {
  let component: WerkerScheduleComponent;
  let fixture: ComponentFixture<WerkerScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
