import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public friendService: FriendsService,
    public cloudService: CloudService,
    public audioService: AudioService
  ) { }

  ngOnInit() {
    var newArray = this.friendService.notifLists.filter(function (el) {
      return el.Notificacion == true;
    });
    newArray.forEach(async element => {
      await this.cloudService.unnotifyList(element.ID);
    });
    newArray = this.friendService.notifSongs.filter(function (el) {
      return el.Notificacion == true;
    });
    newArray.forEach(async element => {
      await this.cloudService.unnotifySong(element.ID);
    });
    /*newArray = this.audioService.notifPodcast.filter(function (el) {
      return el.Notificacion == true;
    });
    newArray.forEach(async element => {
      await this.cloudService.unnotifyPodcast(element.ID);
    });*/
  }

  async deleteSong(song, i) {
    await this.cloudService.unshareSong(song.ID);
    this.friendService.notifSongs.splice(i, 1);
  }

  async deleteList(song, i) {
    await this.cloudService.unshareList(song.ID);
    this.friendService.notifLists.splice(i, 1);
  }

  async deletePodcast(song, i) {
    await this.cloudService.unsharePodcast(song.ID);
    this.audioService.notifPodcast.splice(i, 1);
  }

}
