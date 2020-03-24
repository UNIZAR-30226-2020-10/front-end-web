import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../podcast'
import { PodcastsService } from '../../services/podcasts.service';


@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {

  selectedPodcast: Podcast;

  podcasts: Podcast[];

  ngOnInit(): void {
  }

  //Al seleccionar el titulo de un podcast
  onSelect(podcast: Podcast): void {
    this.selectedPodcast = podcast;
  }
}
