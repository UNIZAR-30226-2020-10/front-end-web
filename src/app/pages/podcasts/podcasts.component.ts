import { Component, OnInit, Input } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { AudioService } from 'src/app/services/audio.service';
import { ActivatedRoute } from '@angular/router';
import { SavePodcastService } from 'src/app/services/save-podcast.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  //Variables
  podcasts: Podcast;
  selectedPodcast: Podcast;
  description: string;
  checkoutForm;
  saved: boolean;
  add: boolean;
  added: boolean;
  title: string;
  temp: string;
  pod;

  constructor(private savePodcast: SavePodcastService, private route: ActivatedRoute, private podcastService: PodcastService, public audioService: AudioService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('id');
    });
    this.pod = this.savePodcast.get();
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
    this.podcastService.getEpisodes(this.pod.id).subscribe(podcasts => this.podcasts = podcasts);
  }

  stripHTML(text) {
    this.temp =  text.replace(/<.*?>/gm, '');
    return this.temp.replace(/\n/gm, ' ');
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
          Artistas: this.pod.publisher_original,
          Imagen: this.podcasts.episodes[i].image,
          ID: undefined,
          Album: undefined,
          title: this.title
        };
        this.audioService.addToQueue(song);
      }
    } else {
      this.audioService.openPodcast(this.podcasts.episodes[0].audio,
        this.podcasts.episodes[0].title, this.pod.publisher_original, this.title, this.podcasts.episodes[0].image);
      for(let i=1; i<this.podcasts.episodes.length; i++){
        var song = {
          URL: this.podcasts.episodes[i].audio,
          Nombre: this.podcasts.episodes[i].title,
          Artistas: this.pod.publisher_original,
          Imagen: this.podcasts.episodes[i].image,
          ID: undefined,
          Album: undefined,
          title: this.title
        };
        this.audioService.addToQueue(song);
      }
    }
  }
}
