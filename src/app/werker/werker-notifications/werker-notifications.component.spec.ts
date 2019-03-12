import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerNotificationsComponent } from './werker-notifications.component';

describe('WerkerNotificationsComponent', () => {
  let component: WerkerNotificationsComponent;
  let fixture: ComponentFixture<WerkerNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
