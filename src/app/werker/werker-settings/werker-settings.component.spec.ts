import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerSettingsComponent } from './werker-settings.component';

describe('WerkerSettingsComponent', () => {
  let component: WerkerSettingsComponent;
  let fixture: ComponentFixture<WerkerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
