import { Component, OnInit } from '@angular/core';
import { CloudService } from './services/cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TuneIT';

  constructor(
    public cloudService: CloudService
  ) { }

  async ngOnInit() {
    await this.cloudService.ngOnInit();
  }

}
