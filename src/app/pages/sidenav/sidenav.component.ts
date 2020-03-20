import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  show: Boolean;

  constructor(
    public audioService: AudioService
  ) {
    this.show = true;
  }

  ngOnInit(): void {
  }

}
