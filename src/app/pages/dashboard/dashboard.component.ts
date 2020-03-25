import { Component, OnInit } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Variables
  podcasts: Podcast[];

  constructor(private podcastService: PodcastService) { }

  ngOnInit(): void {
    this.getPodcasts();
  }

  // Llama a la funcion "getPodcasts" del servicio.
  // Pone una lista de podcasts en @podcasts
  getPodcasts(): void {
    this.podcastService.getPodcasts().subscribe(podcasts => this.podcasts = podcasts.slice(1,5));
  }
}
