import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WerkerSearchComponent } from './werker-search.component';

describe('WerkerSearchComponent', () => {
  let component: WerkerSearchComponent;
  let fixture: ComponentFixture<WerkerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WerkerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WerkerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
