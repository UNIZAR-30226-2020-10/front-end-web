import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-suscribe',
  templateUrl: './suscribe.component.html',
  styleUrls: ['./suscribe.component.scss']
})
export class SuscribeComponent implements OnInit {
  recommended = [];

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService
  ) { }

  async ngOnInit() {
    var aux = undefined;
    aux = await this.cloudService.listArtists();
    for (var i = aux.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = aux[i];
      aux[i] = aux[j];
      aux[j] = temp;
    }
    var i = 0, size = 0;
    while(size < 6 && i < aux.length - 1) {
      if(this.audioService.artistSubscribed(aux[i]) === -1) {
        this.recommended.push(aux[i]);
        ++size;
      }
      ++i;
    }
  }

}
