import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerNotificationComponent } from './maker-notification.component';

describe('MakerNotificationComponent', () => {
  let component: MakerNotificationComponent;
  let fixture: ComponentFixture<MakerNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
