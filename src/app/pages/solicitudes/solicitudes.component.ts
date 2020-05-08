import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { FriendsService } from 'src/app/services/friends.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {

  constructor(
    public cloudService: CloudService,
    public friendService: FriendsService,
    public alertService: AlertsService
  ) { }

  async accept(friend, i) {
    await this.cloudService.accept(friend.ID, "Acepto");
    //this.friendService.friends.push(friend.Emisor[0]);
    this.friendService.petitions.splice(i, 1);
    //this.alertService.showAlert(1, "", "Ahora eres amigo de " + friend.Emisor[0].Nombre);
  }

  async denegate(friend, i) {
    await this.cloudService.accept(friend.ID, "Rechazo");
    this.friendService.petitions.splice(i, 1);
  }

  ngOnInit(): void { }

}
