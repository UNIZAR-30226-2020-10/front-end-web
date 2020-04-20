import { Component, OnInit } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';

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

  constructor(private podcastService: PodcastService, private messageService: MessageService, private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
   }

  ngOnInit(): void {
  }

  // Para el podcast seleccionado
  onSelect(podcast): void {
    this.selectedPodcast = podcast;
    this.podcast_id = this.selectedPodcast.id;
    this.publisher_original = this.selectedPodcast.publisher_original;
    this.podcasts = null;
  }

  onSubmit(title){
    // Tratar los datos aqui
    if(title.titulo.length > 2) {
      this.title_string = title.titulo;
      this.selectedPodcast = null;
      this.getPodcasts();

      this.checkoutForm.reset();
    }
  }

  // Llama a la funcion "getPodcasts" del servicio.
  // Pone una lista de podcasts en @podcasts
  getPodcasts(): void {
    this.podcastService.getPodcasts(this.title_string).subscribe(podcasts => this.podcasts = podcasts);
  }

  // Para saver si un podcast esta guardado o no
  isSaved(title: string): boolean {
    // PREGUNTAR A BACK END SI EL PODCAST @TITLE ESTA GUARDADO
    return false;
  }
}
