import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerHistoryComponent } from './werker-history.component';

describe('WerkerHistoryComponent', () => {
  let component: WerkerHistoryComponent;
  let fixture: ComponentFixture<WerkerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
