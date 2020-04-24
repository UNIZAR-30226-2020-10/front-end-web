import { Component, OnInit, Input } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';
import { AudioService } from 'src/app/services/audio.service';

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
  add: boolean;
  added: boolean;

  constructor(private podcastService: PodcastService, private messageService: MessageService, private formBuilder: FormBuilder, public audioService: AudioService) {
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
  toggleIcon() {
   this.saved = true;
  }

  addToPlayList(): void {
    this.added = true;

    // Comprobar que no haya algo ya reproduciendose
    console.log(this.audioService.checkState());
    if (this.audioService.checkState().playing){
      for(let i=0; i<this.podcasts.episodes.length; i++){
        var song = {
          URL: this.podcasts.episodes[i].audio,
          Nombre: this.podcasts.episodes[i].title,
          Artistas: this.title_string[1],
          Imagen: null,
          ID: undefined,
          Album: undefined
        };
        this.audioService.addToQueue(song);
      }
    } else {
      this.audioService.openPodcast(this.podcasts.episodes[0].audio,
        this.podcasts.episodes[0].title, this.title_string[1]);
      for(let i=1; i<this.podcasts.episodes.length; i++){
        var song = {
          URL: this.podcasts.episodes[i].audio,
          Nombre: this.podcasts.episodes[i].title,
          Artistas: this.title_string[1],
          Imagen: null,
          ID: undefined,
          Album: undefined
        };
        this.audioService.addToQueue(song);
      }
    }

  }
}
