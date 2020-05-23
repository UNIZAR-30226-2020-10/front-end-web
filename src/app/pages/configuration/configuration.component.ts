import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CloudService } from "src/app/services/cloud.service";
import { AlertsService } from "src/app/services/alerts.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"],
})
export class ConfigurationComponent implements OnInit {
  checkoutForm;
  delete: Boolean;
  files: any = [];
  imgURL;

  constructor(
    private formBuilder: FormBuilder,
    public cloudService: CloudService,
    public alertService: AlertsService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      repass: "",
      newpass: "",
      renewpass: "",
      name: "",
      country: "",
    });
  }

  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding("style.background-color") private background = "#f5fcff";
  @HostBinding("style.opacity") private opacity = "1";

  //Dragover listener
  @HostListener("dragover", ["$event"]) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#9ecbec";
    this.opacity = "0.8";
  }

  //Dragleave listener
  @HostListener("dragleave", ["$event"]) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#f5fcff";
    this.opacity = "1";
  }

  //Drop listener
  @HostListener("drop", ["$event"]) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#f5fcff";
    this.opacity = "1";
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  changeFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
    }
    var mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  getSignedRequest(file) {
    if (!file) {
      return alert("no file");
    }
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://psoftware.herokuapp.com/sign_s3?file_name=" +
        this.files[0].name +
        "&file_type=" +
        this.files[0].type
    );
    console.log("LETS GET STARTED");
    console.log(xhr);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          function uploadFile(file, s3Data, url) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", s3Data.url);

            var postData = new FormData();
            for (let key in s3Data.fields) {
              postData.append(key, s3Data.fields[key]);
            }
            postData.append("file", file);

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 204) {
                  (document.getElementById(
                    "preview"
                  ) as HTMLImageElement).src = url;
                } else {
                  alert("Could not upload file.");
                }
              }
            };
            xhr.send(postData);
          }
          uploadFile(file, response.data, response.url);
        } else {
          alert("Could not get signed URL.");
        }
      }
    };
    xhr.send();
  }

  async onSubmit(title) {
    if (title.repass.length === 0) {
      this.alertService.showAlert(2, "", "Introduce tu contraseña actual");
      return;
    }
    let msg;
    const encrepass = this.cloudService.encrypt(title.repass);
    if (this.delete) {
      msg = await this.cloudService.deleteUser(encrepass);
      if (msg === "Success") {
        this.checkoutForm.reset();
        this.alertService.showAlert(1, "", "Usuario eliminado");
        this.router.navigateByUrl("/login");
      } else if (msg === "Contraseña incorrecta") {
        this.alertService.showAlert(0, "", "Contraseña incorrecta");
      } else {
        this.alertService.showAlert(
          0,
          "ERROR",
          "Vuelve a intentarlo más tarde"
        );
      }
      return;
    }
    if (
      (title.name.length > 2 && title.name.length < 51) ||
      title.name.length === 0
    ) {
      if (title.newpass.length > 0 && title.newpass != title.renewpass) {
        this.alertService.showAlert(0, "", "Las contraseñas no coinciden");
      } else if (
        title.newpass.length != 0 &&
        (title.newpass.length < 7 || !this.reg(title.newpass))
      ) {
        this.alertService.showAlert(
          2,
          "",
          "La contraseña debe contener como mínimo 7 carácteres no especiales y 1 número"
        );
      } else {
        if (
          title.name.length === 0 &&
          title.newpass.length === 0 &&
          title.country.length === 0
        ) {
          this.alertService.showAlert(
            2,
            "",
            "Introduce algún campo para modificar"
          );
        } else {
          var encnewpass = title.newpass;
          if (title.newpass.length > 0) {
            encnewpass = this.cloudService.encrypt(title.newpass);
          }
          msg = await this.cloudService.modify(
            encrepass,
            encnewpass,
            title.name,
            title.country
          );
          if (msg === "Success") {
            this.cloudService.userInfo = await this.cloudService.infoUser(
              this.cloudService.user
            );
            this.alertService.showAlert(1, "", "Los cambios se han guardado");
            this.checkoutForm.reset();
            this.router.navigateByUrl("/initial-screen");
          } else if (msg === "Error") {
            this.alertService.showAlert(
              0,
              "ERROR",
              "Vuelve a intentarlo más tarde"
            );
          } else if (msg === "Contreseña incorrecta") {
            this.alertService.showAlert(0, "", "Contraseña incorrecta");
          }
        }
      }
    } else {
      this.alertService.showAlert(
        2,
        "",
        "El nombre debe estar entre 3 y 50 carácteres"
      );
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

  ngOnInit(): void {}
}
