import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../stream-state';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from '../list/list.component';
import { PlaylistsComponent } from '../playlists/playlists.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {

  constructor(
    public audioService: AudioService
  ) { }

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

  ngOnInit() { }

}
