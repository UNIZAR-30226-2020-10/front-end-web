import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';

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
    public cloudService: CloudService
  ) { }

  async register() {
    const email = (<HTMLInputElement> document.getElementById("email")).value;
    const pass = (<HTMLInputElement> document.getElementById("password")).value;
    const repass = (<HTMLInputElement> document.getElementById("repassword")).value;
    const date = (<HTMLInputElement> document.getElementById("date")).value;
    const country = (<HTMLSelectElement> document.getElementById("country")).value;
    const name = "Web";
    if(pass === repass) {
      let msg = await this.cloudService.register(email, pass, name, country, date);
      console.log(msg);
      if(msg === "Contraseña incorrecta") {
        console.log("INCORRECT");

      } else if(msg === "No user") {
        console.log("USER");

      } else if(msg === "Error") {
        console.log("ERROR");

      } else {
        this.router.navigateByUrl('/initial-screen');
      }
    } else {

    }
  }

  ngOnInit(): void {
  }

}
