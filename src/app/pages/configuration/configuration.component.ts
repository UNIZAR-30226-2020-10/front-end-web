import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  checkoutForm;
  lista: string[]=["España","Alemania","Francia", "Inglaterra"];
  delete: Boolean;

  constructor(
    private formBuilder: FormBuilder,
    public cloudService: CloudService,
    public alertService: AlertsService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      repass: '', newpass: '', renewpass: '', name: '', country:''
    });
  }

  async onSubmit(title) {
    if(title.repass.length === 0) {
      this.alertService.showAlert(2, "", "Introduce tu contraseña actual");
      return;
    }
    let msg;
    if(this.delete) {
      msg = await this.cloudService.deleteUser(title.repass);
      if(msg === "Success") {
        this.checkoutForm.reset();
        this.alertService.showAlert(1, "", "Usuario eliminado");
        this.router.navigateByUrl('/login');
      } else if(msg === "Contraseña incorrecta") {
        this.alertService.showAlert(0, "", "Contraseña incorrecta");
      } else {
        this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
      }
      return;
    }
    msg = await this.cloudService.signIn(this.cloudService.user, title.repass, false);
    if(msg === "Contraseña incorrecta") {
      this.alertService.showAlert(0, "", "Contraseña incorrecta");
    } else if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      if((title.name.length > 2 && title.name.length < 51) || title.name.length === 0) {
        if(title.newpass.length > 0 && title.newpass != title.renewpass) {
          this.alertService.showAlert(0, "", "Las contraseñas no coinciden");
        } else {
          if(title.name.length === 0 && title.newpass.length === 0 && title.country.length === 0) {
            this.alertService.showAlert(2, "", "Introduce algún campo para modificar");
          } else {
            msg = await this.cloudService.modify(title.newpass, title.name, title.country);
            if(msg === "Success") {
              this.alertService.showAlert(1, "", "Los cambios se han guardado");
            } else if(msg === "Error") {
              this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
            }
            this.checkoutForm.reset();
            this.router.navigateByUrl('/initial-screen');
          }
        }
      } else {
        this.alertService.showAlert(2, "", "El nombre debe estar entre 3 y 50 carácteres");
      }
    }
  }

  deleteUser() {
    this.delete = true;
  }

  submit() {
    this.delete = false;
  }

  ngOnInit(): void {
  }

}
