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
    const name = (<HTMLInputElement> document.getElementById("text")).value;
    const country = (<HTMLSelectElement> document.getElementById("country")).value;
    if(!email.includes('@') || email.length > 50) {
      this.alertService.showAlert(2, "", "Introduce un email válido");
    } else if(name.length < 3 || name.length > 50) {
      this.alertService.showAlert(2, "", "El nombre debe estar entre 3 y 50 carácteres");
    } else if(pass.length === 0) {
      this.alertService.showAlert(0, "", "Introduce una contraseña");
    } else if(pass.length < 7 || ! this.reg(pass)) {
      this.alertService.showAlert(2, "", "La contraseña debe contener como mínimo 7 carácteres no especiales y 1 número");
    } else if(pass === repass) {
      if(country.length === 0) {
        this.alertService.showAlert(0, "", "Introduce tu país de residencia");
        return;
      }
      const newpass = this.cloudService.encrypt(pass);
      let msg = await this.cloudService.register(email, newpass, name, country, date);
      console.log(msg);
      if(msg === "Clave duplicada") {
        this.alertService.showAlert(0, "", "Usuario ya registrado");
      } else if(msg === "Fecha incorrecta") {
        this.alertService.showAlert(0, "", "Fecha introducida no válida");
      } else if(msg === "Error") {
        this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
      } else {
        this.router.navigateByUrl('/login');
        this.alertService.showAlert(1, "Usuario registrado", "");
      }
    } else {
      this.alertService.showAlert(0, "", "Las contraseñas no coinciden");
    }
  }

  reg(pass) {
    const regex = new RegExp("^[a-zA-Z]*[0-9][0-9a-zA-Z]*$");
    return regex.test(pass);
  }

  ngOnInit(): void {
  }

}
