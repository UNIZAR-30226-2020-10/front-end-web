import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {
  volumeShow: Boolean = false;

  constructor(
    public audioService: AudioService
  ) { }

  changeVolume(change){
    this.audioService.changeVol(change.value);
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  ngOnInit() { }

}
