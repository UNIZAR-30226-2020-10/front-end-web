import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.scss']
})
export class PodcastDetailComponent implements OnInit {

  //Input
  @Input() podcast: Podcast;

  constructor(
    private route: ActivatedRoute,
    private podcastService: PodcastService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getPodcast();
  }

  getPodcast(): void {
    // Cojemos el id del podcast con el que nos han invocado
    const id = +this.route.snapshot.paramMap.get('id');
    this.podcastService.getPodcasts(id).subscribe(podcast => this.podcast = podcast);
  }

}
