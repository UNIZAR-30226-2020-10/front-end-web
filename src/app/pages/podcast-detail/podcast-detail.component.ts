import { Component, OnInit, Input } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { AlertsService } from 'src/app/services/alerts.service';
declare const search: any;

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.scss']
})
export class PodcastDetailComponent implements OnInit {

  @Input() result: Array<any>;

  // Variables
  added: boolean;

  constructor(
    public audioService: AudioService,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
  }

  onPlay(): void {
    this.audioService.openPodcast(this.result[0].audio, this.result[0].id, this.result[0].title, this.result[1], this.result[2], this.result[0].image, this.result[3]);
  }

  stripHTML(text) {
    return text.replace(/<.*?>/gm, '');
  }

  find() {
    var p = {
      'Nombre': this.result[0].title,
      'Artistas': this.result[1]
    }
    search(p);
  }

  // Check if saved podcast
  isSaved(): void {
    //whatever
    this.added = false;
  }

  addToPlayList(): void {
    if(this.added) {
      this.alertService.showAlert(2, "", "Ya se han añadido los episodios");
      return;
    }
    this.added = true;
    var song = {
      URL: this.result[0].audio,
      Nombre: this.result[0].title,
      Artistas: [this.result[1]],
      Imagen: this.result[0].image,
      ID: this.result[0].id,
      Album: undefined,
      title: this.result[2],
      Categorias: ["Podcast"],
      PID: this.result[3]
    };

    // Comprobar que no haya algo ya reproduciendose
    if (this.audioService.maxIndex > 0){
      this.audioService.addToQueue(song);
    } else {
      this.audioService.loadList([song], 0, 'p');
    }
  }
}
