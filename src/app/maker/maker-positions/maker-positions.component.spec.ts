import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerPositionsComponent } from './maker-positions.component';

describe('MakerPositionsComponent', () => {
  let component: MakerPositionsComponent;
  let fixture: ComponentFixture<MakerPositionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerPositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
