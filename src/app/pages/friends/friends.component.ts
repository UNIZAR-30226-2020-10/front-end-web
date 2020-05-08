import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { FriendsService } from 'src/app/services/friends.service';
import { interval, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  search: Boolean = false;
  petitions: Boolean = false;

  constructor(
    public cloudService: CloudService,
    public alertService: AlertsService,
    public friendService: FriendsService,
    private loader: LoaderService
  ) { }

  async deleteFriend(friend, i) {
    await this.cloudService.deleteFriend(friend.Email);
    this.friendService.friends.splice(i, 1);
    this.alertService.showAlert(1, "", "Ya no eres amigo de " + friend.Nombre);
  }

  isActual(i) {
    if((this.search && i === 2) || (this.petitions && i === 1) ||
      (!this.search && !this.petitions && i === 0)) {
      return "selected";
    }
    return "notification";
  }

  async actualize() {
    console.log("ACTUALIZAR FRIEND");
    this.loader.necessary = false;
    const aux = await this.cloudService.petitionsReceive();
    this.loader.necessary = true;
    this.friendService.actualizePetitions(aux);
  }

  async ngOnInit() {
    this.friendService.friends = await this.cloudService.friends();
    this.loader.necessary = false;
    const aux = await this.cloudService.petitionsReceive();
    this.loader.necessary = true;
    this.friendService.actualizePetitions(aux);
    const source = interval(15000);
    this.subscription = source.subscribe(() => this.actualize());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
