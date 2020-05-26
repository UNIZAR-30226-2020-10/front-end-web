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
      const msg = await this.cloudService.newFriend(user.Email);
      if(msg === "Success") {
        this.alertService.showAlert(1, "", "Enviada petición de amistad a " + user.Nombre);
      } else if(msg === "Ya hay una solicitud pendiente") {
        this.alertService.showAlert(2, "", user.Nombre + " ya tiene una solicitud");
      } else {
        this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
      }
    }
  }

  async onSubmit(title) {
    if(title.titulo.length < 1) {
      this.alertService.showAlert(2, "", "Introduce un nombre para buscar");
    } else {
      this.users = await this.cloudService.searchUsers(title.titulo);
      for(let i = 0; i < this.users.length; ++i) {
        if(this.users[i].Email === this.cloudService.user || this.friendService.addedFriend(this.users[i])) {
          this.users.splice(i, 1);
          --i;
        }
      }
      if(this.users.length === 0) {
        this.alertService.showAlert(3, "", "No se ha encontrado ningún usuario");
      }
    }
  }

  ngOnInit(): void {
  }

}
