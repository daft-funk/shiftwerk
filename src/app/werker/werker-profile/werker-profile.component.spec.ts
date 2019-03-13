import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerProfileComponent } from './werker-profile.component';

describe('WerkerProfileComponent', () => {
  let component: WerkerProfileComponent;
  let fixture: ComponentFixture<WerkerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
