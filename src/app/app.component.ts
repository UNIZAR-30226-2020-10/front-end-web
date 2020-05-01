import { Component } from '@angular/core';
import { CloudService } from './services/cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TuneIT';

  constructor(
    public cloudService: CloudService
  ) {
    this.cloudService.ngOnInit();
  }

}
