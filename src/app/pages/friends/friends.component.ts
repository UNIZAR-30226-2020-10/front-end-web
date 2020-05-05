import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  checkoutForm;
  users;

  constructor(
    private formBuilder: FormBuilder,
    public cloudService: CloudService,
    public alertService: AlertsService
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  async onSubmit(title) {
    this.users = await this.cloudService.searchUsers(title.titulo);
    if(this.users.length === 0) {
      this.alertService.showAlert(3, "", "No se ha encontrado ningún usuario");
    }
  }

  ngOnInit(): void {
  }

}
