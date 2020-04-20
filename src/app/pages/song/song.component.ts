import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare const search: any;

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnDestroy, OnInit {

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService,
    private route: Router,
    private location: Location
  ) { }

  returnBack() {
    this.location.back();
  }

  changeVolume(change){
    this.audioService.changeVol(change.value);
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  find() {
    search(this.audioService.currentFile.song);
  }

  loop() {
    if(this.audioService.loop) {
      return "loopAct";
    }
    return "";
  }

  addToPlaylist() {
    this.audioService.passSong = Object.assign({}, this.audioService.currentFile.song);
    this.route.navigate(['/song/add']);
  }

  ngOnDestroy(): void {
    this.audioService.showSong = false;
  }

  ngOnInit(): void {

  }

}
