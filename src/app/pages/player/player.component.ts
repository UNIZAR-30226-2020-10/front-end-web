import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../stream-state';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {
  currentFile: any = {};
  state: StreamState;
  currentList: Array<any> = [];
  list: ListComponent;

  constructor(
    public audioService: AudioService,
    private route: ActivatedRoute
  ) {
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.currentList.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  playStream(url) {
    this.audioService.playStream(url).subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.currentList[index];
    this.openFile(file, index);
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.currentList[index];
    this.openFile(file, index);
  }

  stop() {
    this.audioService.stop();
  }

  play() {
    this.audioService.play();
  }

  changeList(files) {
    this.currentList = files;
  }

  equals(files) {
    if(this.currentList.length != files.length) {
      return false;
    }
    for (let index = 0; index < this.currentList.length; index++) {
      if(this.currentList[index] != files[index]) {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.list = new ListComponent(new CloudService, this.route);
    });
  }

}
