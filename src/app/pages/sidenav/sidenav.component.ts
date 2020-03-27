import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  change: string;

  constructor(
    public audioService: AudioService
  ) {
    this.change = 'change-right';
  }

  changeStyle() {
    if(this.change == 'change-right') {
      this.change = 'change-left';
    } else {
      this.change = 'change-right';
    }
  }

  ngOnInit(): void {
  }

}
