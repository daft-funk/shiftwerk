import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerCreateShiftComponent } from './maker-create-shift.component';

describe('MakerCreateShiftComponent', () => {
  let component: MakerCreateShiftComponent;
  let fixture: ComponentFixture<MakerCreateShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerCreateShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerCreateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
