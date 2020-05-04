import { Injectable } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  // type == 0            -> ERROR
  // type == 1            -> SUCCESS
  // type == 2            -> WARNING
  // type > 2 || type < 0 -> INFO
  alert: String = "fade";
  body: String = "";
  strong: String = "";
  timer;

  constructor() { }

  showAlert(type, strong, body) {
    clearTimeout(this.timer);
    if(type === 1) {
      this.alert = "alert success";
    } else if(type === 2) {
      this.alert = "alert warning";
    } else if(type === 3) {
      this.alert = "alert info"
    } else {
      this.alert = "alert";
    }
    this.body = body;
    this.strong = strong;
    this.timer = setTimeout(() => { this.close() }, 2400);
  }

  close() {
    this.alert = this.alert + " fade";
  }
}
