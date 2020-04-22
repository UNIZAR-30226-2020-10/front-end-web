import { Component, OnInit, Input } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  @Input() title_string: Array<string>;

  //Variables
  podcasts: Podcast;
  selectedPodcast: Podcast;
  description: string;
  checkoutForm;
  saved: boolean;

  constructor(private podcastService: PodcastService, private messageService: MessageService, private formBuilder: FormBuilder) {
   }

  ngOnInit(): void {
    this.selectedPodcast = null;
    this.getPodcasts();
  }

  // Para el podcast seleccionado
  onSelect(podcast): void {
    this.selectedPodcast = podcast;
    this.podcasts = null;
  }

  // Llama a la funcion "getEpisodes" del servicio.
  // Pone una lista de episodios en @podcasts
  getPodcasts(): void {
    this.podcastService.getEpisodes(this.title_string[0]).subscribe(podcasts => this.podcasts = podcasts);
  }

  stripHTML(text) {
    return text.replace(/<.*?>/gm, '');
  }

  // Check if saved podcast
  isSaved(): void {
    //whatever
    this.saved = false;
  }

  // To save a podcast
  toggleIcon(): void {
   this.saved = !this.saved;
  }
}
