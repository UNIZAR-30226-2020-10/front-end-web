import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  // type == 0            -> ERROR
  // type == 1            -> SUCCESS
  // type == 2            -> WARNING
  // type > 2 || type < 0 -> INFO
  alert: String = "";
  body: String = "";
  strong: String = "";
  use: Boolean = false;

  constructor() { }

  showAlert(type, strong, body) {
    if(type === 0) {
      this.alert = "alert";
    } else if(type === 1) {
      this.alert = "alert success";
    } else if(type === 2) {
      this.alert = "alert warning";
    } else {
      this.alert = "alert info"
    }
    this.body = body;
    this.strong = strong;
    this.use = true;
  }
}
