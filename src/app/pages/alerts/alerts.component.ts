import { Component, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  constructor(
    public alertService: AlertsService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.alertService.alert = this.alertService.alert + " fade";
  }

}
