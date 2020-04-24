import { TestBed } from '@angular/core/testing';

import { SavePodcastService } from './save-podcast.service';

describe('SavePodcastService', () => {
  let service: SavePodcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePodcastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
