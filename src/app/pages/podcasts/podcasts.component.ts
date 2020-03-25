import { Component, OnInit } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { PODCASTS } from 'src/app/mock-podcasts';
import { HttpErrorResponse } from '@angular/common/http';
import { PodcastService } from 'src/app/services/podcast.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  //Variables
  podcasts: Podcast[];
  selectedPodcast: Podcast;
  checkoutForm;

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

  onSubmit(title: string){
    // Tratar los datos aqui
    this.getPodcasts(title);

    this.checkoutForm.reset();
  }

  // Llama a la funcion "getPodcasts" del servicio.
  // Pone una lista de podcasts en @podcasts
  getPodcasts(title): void {
    this.podcastService.getPodcasts(title).subscribe(podcasts => this.podcasts = podcasts);
  }
}
