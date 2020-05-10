import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public cloudService: CloudService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goTo() {
    if(this.cloudService.user) {
      this.router.navigateByUrl('/initial-screen');
    } else {
      this.router.navigateByUrl('');
    }
  }

}
