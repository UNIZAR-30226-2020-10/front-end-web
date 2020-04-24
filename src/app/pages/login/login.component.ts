import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    public cloudService: CloudService
  ) { }

  ngOnInit(): void {
  }

  async sign() {
    const email = (<HTMLInputElement> document.getElementById("email")).value;
    const pass = (<HTMLInputElement> document.getElementById("password")).value;
    let msg = await this.cloudService.signIn(email, pass);
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
  }

}
