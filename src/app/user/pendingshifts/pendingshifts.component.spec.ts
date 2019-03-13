import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingshiftsComponent } from './pendingshifts.component';

describe('PendingshiftsComponent', () => {
  let component: PendingshiftsComponent;
  let fixture: ComponentFixture<PendingshiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingshiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
