import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public cloudService: CloudService
  ) { }

  ngOnInit(): void {
  }

}
