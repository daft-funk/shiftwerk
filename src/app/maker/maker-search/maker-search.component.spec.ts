import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerSearchComponent } from './maker-search.component';

describe('MakerSearchComponent', () => {
  let component: MakerSearchComponent;
  let fixture: ComponentFixture<MakerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
