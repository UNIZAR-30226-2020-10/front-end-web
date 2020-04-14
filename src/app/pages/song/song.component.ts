import { Component, OnDestroy } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';
declare const search: any;

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnDestroy {

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

  find() {
    search(this.audioService.currentFile.song);
  }

  addToList(list) {
    if(list == 'c') {
      this.audioService.addToQueue(this.audioService.currentFile.song);
    } else {
      this.cloudService.addSong(this.audioService.currentFile.song, list);
    }
  }

  loop() {
    if(this.audioService.loop) {
      return "loopAct";
    }
    return "";
  }

  ngOnDestroy(): void {
    this.audioService.showSong = false;
  }

}
