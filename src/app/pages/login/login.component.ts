import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  session: boolean;

  constructor(
    private router: Router,
    public cloudService: CloudService,
    public alertService: AlertsService,
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
  }

  async sign() {
    const email = (<HTMLInputElement> document.getElementById("email")).value;
    const pass = (<HTMLInputElement> document.getElementById("password")).value;
    console.log(this.session);
    let msg = await this.cloudService.signIn(email, pass, this.session);
    console.log(msg);
    if(msg === "Contraseña incorrecta") {
      console.log("INCORRECT");
      this.alertService.showAlert(0, "", "Contraseña incorrecta");
    } else if(msg === "No user") {
      console.log("USER");
      this.alertService.showAlert(0, "", "No existe el usuario introducido");
    } else if(msg === "Error") {
      console.log("ERROR");
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.cloudService.userInfo = await this.cloudService.infoUser();
      this.audioService.lists = await this.cloudService.getPlaylists();
      this.audioService.favList(await this.cloudService.getList(this.audioService.lists[0].ID));
      this.audioService.favoriteID = this.audioService.lists[0].ID;
      this.router.navigateByUrl('/initial-screen');
      this.alertService.showAlert(1, "", "¡Bienvenido de nuevo!");
    }
  }

}
