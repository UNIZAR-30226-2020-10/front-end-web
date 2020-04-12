import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {
  volumeShow: Boolean = false;

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService
  ) { }

  changeVolume(change){
    this.audioService.changeVol(change.value);
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  addToList(list) {
    if(list == 'c') {
      this.audioService.addToQueue(this.audioService.currentFile.song);
    } else {
      this.cloudService.addSong(this.audioService.currentFile.song, list);
    }
  }

  ngOnInit() { }

}
