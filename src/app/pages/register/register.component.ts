import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  lista: string[]=["España","Alemania","Francia", "Inglaterra"];
  seleccionado: string;

  constructor(
    private router: Router,
    public cloudService: CloudService,
    public alertService: AlertsService
  ) { }

  async register() {
    const email = (<HTMLInputElement> document.getElementById("email")).value;
    const pass = (<HTMLInputElement> document.getElementById("password")).value;
    const repass = (<HTMLInputElement> document.getElementById("repassword")).value;
    const date = (<HTMLInputElement> document.getElementById("date")).value;
    const country = (<HTMLSelectElement> document.getElementById("country")).value;
    const name = "Web";
    if(pass.length === 0) {
      this.alertService.showAlert(0, "", "Introduce una contraseña");
    } else if(pass === repass) {
      if(country.length === 0) {
        this.alertService.showAlert(0, "", "Introduce tu país de residencia");
        return;
      }
      let msg = await this.cloudService.register(email, pass, name, country, date);
      console.log(msg);
      if(msg === "Clave duplicada") {
        this.alertService.showAlert(0, "", "Usuario ya registrado");
      } else if(msg === "Fecha incorrecta") {
        this.alertService.showAlert(0, "", "Fecha introducida no válida");
      } else if(msg === "Error") {
        this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
      } else {
        this.router.navigateByUrl('/initial-screen');
        this.alertService.showAlert(1, "Bienvenido", "");
      }
    } else {
      this.alertService.showAlert(0, "", "Las contraseñas no coinciden");
    }
  }

  ngOnInit(): void {
  }

}
