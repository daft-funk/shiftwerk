import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerProfileComponent } from './maker-profile.component';

describe('MakerProfileComponent', () => {
  let component: MakerProfileComponent;
  let fixture: ComponentFixture<MakerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
