import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPodcastComponent } from './search-podcast.component';

describe('SearchPodcastComponent', () => {
  let component: SearchPodcastComponent;
  let fixture: ComponentFixture<SearchPodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
