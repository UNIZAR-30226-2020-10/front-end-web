import { Component } from '@angular/core';
import { CloudService } from './services/cloud.service';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TuneIT';

  constructor() { }

}
