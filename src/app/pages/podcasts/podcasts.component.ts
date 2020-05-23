import { Component, OnInit, Input } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { AudioService } from 'src/app/services/audio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SavePodcastService } from 'src/app/services/save-podcast.service';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { FriendsService } from 'src/app/services/friends.service';

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

  constructor(
    private savePodcast: SavePodcastService,
    private route: ActivatedRoute,
    private router: Router,
    private podcastService: PodcastService,
    public audioService: AudioService,
    public cloudService: CloudService,
    private alertService: AlertsService,
    private friendService: FriendsService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('id');
    });
    this.pod = this.savePodcast.get();
    this.saved = await this.cloudService.isPodcastFavorite(this.pod.id);
    console.log(this.pod.publisher_original)
    console.log(this.saved);
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

  // To save a podcast
  async toggleIcon() {
    this.saved = !this.saved;
    console.log(this.pod.id + " title: " + this.title);
    if(!this.saved) {
      await this.cloudService.deletePodcast(this.pod.id);
    } else {
      await this.cloudService.addPodcast(this.pod.id, this.title);
    }
    this.audioService.idsPodcasts(await this.cloudService.listPodcast());
  }

  share() {
    if(this.friendService.friends && this.friendService.friends.length === 0) {
      this.alertService.showAlert(0, "", "No tienes ningún amigo");
      return;
    }
    var song = {
      URL: '',
      Nombre: '',
      Artistas: '',
      Imagen: '',
      ID: '',
      Album: undefined,
      title: this.title,
      Categorias: ["Podcast"],
      PID: this.pod.id
    };
    this.audioService.passSong = song;
    this.router.navigateByUrl('/share');
  }

  addToPlayList(): void {
    if(this.added) {
      this.alertService.showAlert(2, "", "Ya se han añadido los episodios");
      return;
    }
    this.added = true;

    // Comprobar que no haya algo ya reproduciendose
    if(this.audioService.maxIndex > 0){
      for(let i=0; i<this.podcasts.episodes.length; i++){
        var song = {
          URL: this.podcasts.episodes[i].audio,
          Nombre: this.podcasts.episodes[i].title,
          Artistas: [this.pod.publisher_original || this.pod.publisher],
          Imagen: this.podcasts.episodes[i].image,
          ID: this.podcasts.episodes[i].id,
          Album: undefined,
          title: this.title,
          Categorias: ["Podcast"],
          PID: this.pod.id
        };
        this.audioService.addToQueue(song);
      }
    } else {
      var list = [];
      for(let i=0; i<this.podcasts.episodes.length; i++){
        var song = {
          URL: this.podcasts.episodes[i].audio,
          Nombre: this.podcasts.episodes[i].title,
          Artistas: [this.pod.publisher_original || this.pod.publisher],
          Imagen: this.podcasts.episodes[i].image,
          ID: this.podcasts.episodes[i].id,
          Album: undefined,
          title: this.title,
          Categorias: ["Podcast"],
          PID: this.pod.id
        };
        list.push(song);
      }
      this.audioService.loadList(list, 0, 'p');
    }
  }
}
