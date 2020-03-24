import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Podcast } from '../../podcast'
import { PodcastsService } from '../../services/podcasts.service';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcastSearch.component.html',
  styleUrls: ['./podcastSearch.component.scss']
})
export class podcastSearch implements OnInit {

  podcastsForm;
  totalAngularPackages;

  podcast: Podcast[];

  podcasts = this.podcast;
  selectedPodcast: Podcast;

  constructor(
    private http: HttpClient,
    private podcastService: PodcastsService,
    private formBuilder: FormBuilder
  ) {
    this.podcastsForm = this.formBuilder.group({ title: ''});
   }

  ngOnInit(): void {
  }

  onSubmit(title){
    this.podcastsForm.reset();

    console.warn('Titulo seleccionado: ', title);

    this.getPodcasts(title);
  }

  getPodcasts(title: String): void {
    this.podcastService.getPodcasts(title)
      .subscribe(podcasts => this.podcasts = podcasts);
  }

}
