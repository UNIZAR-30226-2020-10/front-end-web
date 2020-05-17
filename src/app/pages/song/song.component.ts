import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertsService } from 'src/app/services/alerts.service';
import { FriendsService } from 'src/app/services/friends.service';
declare const search: any;

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnDestroy, OnInit {
  aux;

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService,
    private route: Router,
    private location: Location,
    private alertService: AlertsService,
    private friendService: FriendsService
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

  album() {
    if(this.audioService.currentFile.song.title) {
      this.route.navigate(['/podcasts', this.audioService.currentFile.song.title]);
    } else {
      this.route.navigate(['/album', this.audioService.currentFile.song.Album]);
    }
  }

  share() {
    if(this.friendService.friends && this.friendService.friends.length === 0) {
      this.alertService.showAlert(0, "", "No tienes ningún amigo");
      return;
    }
    this.audioService.passSong = this.audioService.currentFile.song;
    this.route.navigateByUrl('/share');
  }

  async favorite() {
    this.audioService.songFav = !this.audioService.songFav;
    if(this.audioService.currentFile.song.title) {
      if(this.audioService.songFav) {
        await this.cloudService.addPodcast(this.audioService.currentFile.song.ID, this.audioService.currentFile.song.title);
      } else {
        await this.cloudService.deletePodcast(this.audioService.currentFile.song.ID);
      }
      this.audioService.idsPodcasts(await this.cloudService.listPodcast());
    } else {
      if(this.audioService.songFav) {
        await this.cloudService.addSong(this.audioService.currentFile.song.ID, this.audioService.favoriteID);
        this.audioService.addToFav(this.audioService.currentFile.song);
      } else {
        await this.cloudService.deleteSong(this.audioService.currentFile.song.ID, this.audioService.favoriteID);
        this.audioService.dropFav(this.audioService.currentFile.index);
      }
    }
  }

  ngOnDestroy(): void {
    this.audioService.showSong = false;
  }

  ngOnInit(): void {
    this.audioService.showSong = true;
  }

}
