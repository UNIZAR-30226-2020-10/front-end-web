import { Component, OnInit, Input } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
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
    public audioService: AudioService
  ) { }

  ngOnInit(): void {
  }

  onPlay(): void {
    this.audioService.openPodcast(this.result[0].audio, this.result[0].title, this.result[1], this.result[2], this.result[0].image);
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
    this.added = true;

    // Comprobar que no haya algo ya reproduciendose
    console.log(this.audioService.checkState());
    if (this.audioService.checkState().playing){
      var song = {
        URL: this.result[0].audio,
        Nombre: this.result[0].title,
        Artistas: this.result[1],
        Imagen: this.result[0].image,
        ID: undefined,
        Album: undefined,
        title: this.result[2]

      };
      this.audioService.addToQueue(song);
    } else {
      this.audioService.openPodcast(this.result[0].audio,
        this.result[0].title, this.result[1], this.result[2], this.result[0].image);
    }
  }
}
