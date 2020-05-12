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
    const encrepass = this.cloudService.encrypt(title.repass);
    if(this.delete) {
      msg = await this.cloudService.deleteUser(encrepass);
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
    if((title.name.length > 2 && title.name.length < 51) || title.name.length === 0) {
      if(title.newpass.length > 0 && title.newpass != title.renewpass) {
        this.alertService.showAlert(0, "", "Las contraseñas no coinciden");
      } else if(title.newpass.length != 0 && (title.newpass.length < 7 || ! this.reg(title.newpass))) {
        this.alertService.showAlert(2, "", "La contraseña debe contener como mínimo 7 carácteres no especiales y 1 número");
      } else {
        if(title.name.length === 0 && title.newpass.length === 0 && title.country.length === 0) {
          this.alertService.showAlert(2, "", "Introduce algún campo para modificar");
        } else {
          var encnewpass = title.newpass;
          if(title.newpass.length > 0) {
            encnewpass = this.cloudService.encrypt(title.newpass);
          }
          msg = await this.cloudService.modify(encrepass, encnewpass, title.name, title.country);
          if(msg === "Success") {
            this.cloudService.userInfo = await this.cloudService.infoUser(this.cloudService.user);
            this.alertService.showAlert(1, "", "Los cambios se han guardado");
            this.checkoutForm.reset();
            this.router.navigateByUrl('/initial-screen');
          } else if(msg === "Error") {
            this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
          } else if(msg === "Contreseña incorrecta") {
            this.alertService.showAlert(0, "", "Contraseña incorrecta");
          }
        }
      }
    } else {
      this.alertService.showAlert(2, "", "El nombre debe estar entre 3 y 50 carácteres");
    }
  }

  reg(pass) {
    const regex = new RegExp("^[a-zA-Z]*[0-9][0-9a-zA-Z]*$");
    return regex.test(pass);
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
