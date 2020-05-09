import { Component, OnInit } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';
import { SavePodcastService } from 'src/app/services/save-podcast.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-search-podcast',
  templateUrl: './search-podcast.component.html',
  styleUrls: ['./search-podcast.component.scss']
})
export class SearchPodcastComponent implements OnInit {

  //Variables
  podcasts: Podcast;
  selectedPodcast;
  checkoutForm;
  title_string: string;
  podcast_id: string;
  showFirst;
  publisher_original: string;
  icon: boolean;
  ids;
  favPodcasts;

  constructor(
    private podcastService: PodcastService,
    private formBuilder: FormBuilder,
    private savePodcast: SavePodcastService,
    public alertService: AlertsService,
    public cloudService: CloudService
    ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
   }

  async ngOnInit() {
    this.title_string = "undefined";
    this.podcasts = this.savePodcast.restoreState();
    this.ids = await this.cloudService.listPodcast();
    if(this.ids.length > 0) {
      var ids = this.ids[0];
      for(let id of this.ids) {
        ids += "," + id;
      }
      this.ids.shift();
      this.ids.shift();
      this.podcastService.getPodcastsPost(ids).subscribe(favPodcasts => this.favPodcasts = favPodcasts);
    }
  }

  // Para el podcast seleccionado
  onSelect(podcast): void {
    // Guardar podcast en un servicio.
    this.savePodcast.save(podcast);
    this.savePodcast.saveState(this.podcasts);
  }

  onSubmit(title){
    // Tratar los datos aqui
    if(title.titulo.length > 2) {
      this.title_string = title.titulo;
      this.selectedPodcast = null;
      this.getPodcasts(this.title_string);

      this.checkoutForm.reset();
    } else {
      this.alertService.showAlert(2, "", "La búsqueda requiere un mínimo de 3 carácteres");
    }
  }

  // Llama a la funcion "getPodcasts" del servicio.
  // Pone una lista de podcasts en @podcasts
  getPodcasts(search): void {
    this.podcastService.getPodcasts(search).subscribe(podcasts => this.podcasts = podcasts);
  }

  // Para saver si un podcast esta guardado o no
  isSaved(title: string) {
    // PREGUNTAR A BACK END SI EL PODCAST @TITLE ESTA GUARDADO
    this.icon = true;
  }

  isFavorite() {
    if(this.title_string === 'undefined') {
      return this.favPodcasts.podcasts;
    } else {
      return this.podcasts.results;
    }
  }
}
