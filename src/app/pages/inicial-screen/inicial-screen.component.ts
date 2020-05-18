import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-inicial-screen',
  templateUrl: './inicial-screen.component.html',
  styleUrls: ['./inicial-screen.component.scss']
})
export class InicialScreenComponent implements OnInit {
  songs;
  showAdd: Number = 8;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService
  ) {
    
  }

  addToQueue() {
    if(this.audioService.checkState().playing) {
      for(let song of this.songs) {
        this.audioService.addToQueue(song);
      }
    } else {
      this.audioService.loadList(this.songs, 0, 'l');
    }
  }

  async ngOnInit() {
    this.songs = await this.cloudService.getSongs();
    this.songs.reverse().splice(this.showAdd);
    console.log(this.songs);
  }

}
