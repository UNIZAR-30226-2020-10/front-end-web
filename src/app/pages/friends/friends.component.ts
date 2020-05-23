import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { FriendsService } from 'src/app/services/friends.service';
import { Location } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  search: Boolean = false;
  share: Boolean;

  constructor(
    public cloudService: CloudService,
    public alertService: AlertsService,
    public friendService: FriendsService,
    private router: ActivatedRoute,
    private location: Location,
    private audioService: AudioService
  ) {
    this.share = this.router.snapshot.data['share'];
  }

  async deleteFriend(friend, i) {
    await this.cloudService.deleteFriend(friend.Email);
    this.friendService.friends.splice(i, 1);
    this.alertService.showAlert(1, "", "Ya no eres amigo de " + friend.Nombre);
  }

  isActual(i) {
    if((this.search && i === 2) || (!this.search && i === 0)) {
      return "selected";
    }
    return "notification";
  }

  clear() {
    delete this.audioService.passSong;
    this.location.back();
  }

  async shared(friend) {
    var msg;
    if(this.audioService.passSong.title) {
      msg = await this.cloudService.sharePodcast(this.audioService.passSong.PID, friend.Email);
    } else if(this.audioService.passSong.Categorias) {
      msg = await this.cloudService.shareSong(this.audioService.passSong.ID, friend.Email);
    } else {
      msg = await this.cloudService.shareList(this.audioService.passSong.ID, friend.Email);
    }
    if(msg === "Elemento ya compartido con ese usuario") {
      this.alertService.showAlert(0, "", "Canción/lista ya compartida con " + friend.Nombre);
    } else if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.alertService.showAlert(1, "", "Canción/lista compartida con " + friend.Nombre);
    }
    this.clear();
  }

  async ngOnInit() {
    this.friendService.friends = await this.cloudService.friends();
  }

}
