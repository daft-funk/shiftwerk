import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerHomeComponent } from './werker-home.component';

describe('WerkerHomeComponent', () => {
  let component: WerkerHomeComponent;
  let fixture: ComponentFixture<WerkerHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
