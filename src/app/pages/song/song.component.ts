import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
declare const showSong: any;

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  constructor(
    public audioService: AudioService
  ) { }

  changeVolume(change){
    this.audioService.changeVol(change.value);
  }

  isFirstPlaying() {
    return this.audioService.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.audioService.currentFile.index === this.audioService.maxIndex - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  pause() {
    this.audioService.pause();
  }

  previous() {
    this.audioService.previous();
  }

  next() {
    this.audioService.next();
  }

  stop() {
    this.audioService.stop();
  }

  play() {
    this.audioService.play();
  }

  equals(files) {
    return this.audioService.equals(files);
  }

  ngOnInit(): void {
  }

}
