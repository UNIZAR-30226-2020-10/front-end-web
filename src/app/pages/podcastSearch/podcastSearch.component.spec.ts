import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { podcastSearch } from './podcastSearch.component';

describe('PodcastComponent', () => {
  let component: podcastSearch;
  let fixture: ComponentFixture<podcastSearch>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ podcastSearch ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(podcastSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
