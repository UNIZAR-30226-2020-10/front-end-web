import { Component, OnInit } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { HttpErrorResponse } from '@angular/common/http';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  //Variables
  podcasts: Podcast;
  selectedPodcast: Podcast;
  checkoutForm;
  title_string: string;

  constructor(private podcastService: PodcastService, private messageService: MessageService, private formBuilder: FormBuilder,) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
   }

  ngOnInit(): void {
  }

  // Para el podcast seleccionado
  onSelect(podcast: Podcast): void {
    this.selectedPodcast = podcast;
  }

  onSubmit(title){
    // Tratar los datos aqui
    this.title_string = title.titulo;
    this.getPodcasts();

    this.checkoutForm.reset();
  }

  // Llama a la funcion "getPodcasts" del servicio.
  // Pone una lista de podcasts en @podcasts
  getPodcasts(): void {
    this.podcastService.getPodcasts(this.title_string).subscribe(podcasts => this.podcasts = podcasts);
    this.checkoutForm.reset();
  }
}
