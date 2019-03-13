import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerSettingsComponent } from './maker-settings.component';

describe('MakerSettingsComponent', () => {
  let component: MakerSettingsComponent;
  let fixture: ComponentFixture<MakerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
