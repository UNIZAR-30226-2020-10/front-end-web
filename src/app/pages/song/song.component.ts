import { Component, OnDestroy } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
declare const showSong: any;

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnDestroy {

  constructor(
    public audioService: AudioService
  ) { }

  changeVolume(change){
    this.audioService.changeVol(change.value);
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  ngOnDestroy(): void {
    this.audioService.showSong = false;
  }

}
