import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  checkoutForm;

  constructor(
    public audioService: AudioService,
    private formBuilder: FormBuilder,
    private router: Router,
    public cloudService: CloudService,
    public alertService: AlertsService
  ) {
    if(this.cloudService.user == undefined) {
      this.cloudService.change = 'nothing';
    } else {
      this.cloudService.change = 'change-right';
    }
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  changeStyle() {
    if(this.cloudService.user == undefined) {
      this.cloudService.change = 'nothing';
    } else if(this.cloudService.change == 'change-right') {
      this.cloudService.change = 'change-left';
    } else {
      this.cloudService.change = 'change-right';
    }
  }

  onSubmit(title){
    if(title.titulo.length > 2) {
      this.router.navigate(['/search', title.titulo]);
      this.checkoutForm.reset();
    } else {
      this.alertService.showAlert(2, "", "La búsqueda requiere un mínimo de 3 carácteres");
    }
  }

  ngOnInit(): void {
  }

}
