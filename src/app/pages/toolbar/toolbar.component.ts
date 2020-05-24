import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  value;

  constructor(
    public cloudService: CloudService,
    private router: Router,
    public friendService: FriendsService
  ) {
    this.friendService.pend.subscribe(value => {
      this.value = value;
    })
  }

  ngOnInit(): void {
  }

  goTo() {
    if(this.cloudService.user) {
      this.router.navigateByUrl('/music');
    } else {
      this.router.navigateByUrl('');
    }
  }

}
