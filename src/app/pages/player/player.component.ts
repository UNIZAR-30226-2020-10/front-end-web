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

  async favorite() {
    this.audioService.songFav = !this.audioService.songFav;
    if(this.audioService.songFav) {
      this.cloudService.addSong(this.audioService.currentFile.song.ID, this.audioService.favoriteID);
      this.audioService.addToQueue(this.audioService.currentFile.song);
    } else {
      this.cloudService.deleteSong(this.audioService.currentFile.song.ID, this.audioService.favoriteID);
      this.audioService.dropFav(this.audioService.currentFile.index);
    }
  }

  async ngOnInit() {
    if(this.cloudService.user != undefined) {
      this.audioService.lists = await this.cloudService.getPlaylists();
      this.audioService.favoriteID = this.audioService.lists[0].ID;
      this.audioService.favList(await this.cloudService.getList(this.audioService.lists[0].ID));
    }
  }

}
