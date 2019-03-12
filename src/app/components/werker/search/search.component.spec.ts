import { TestBed, async } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular6App'`, () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Angular6App');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
