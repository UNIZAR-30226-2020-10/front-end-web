import { Component, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';
import { CloudService } from 'src/app/services/cloud.service';
import { FormBuilder } from '@angular/forms';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-buscar-amigos',
  templateUrl: './buscar-amigos.component.html',
  styleUrls: ['./buscar-amigos.component.scss']
})
export class BuscarAmigosComponent implements OnInit {
  users;
  checkoutForm;

  constructor(
    public alertService: AlertsService,
    public cloudService: CloudService,
    private formBuilder: FormBuilder,
    public friendService: FriendsService
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  async addFriend(user) {
    if(this.friendService.addedFriend(user)) {
      this.alertService.showAlert(0, "", user.Nombre + " ya es tu amigo");
    } else {
      await this.cloudService.newFriend(user.Email);
      this.alertService.showAlert(1, "", "Enviada petición de amistad a " + user.Nombre);
    }
  }

  async onSubmit(title) {
    this.users = await this.cloudService.searchUsers(title.titulo);
    if(this.users.length === 0) {
      this.alertService.showAlert(3, "", "No se ha encontrado ningún usuario");
    }
  }

  ngOnInit(): void {
  }

}
