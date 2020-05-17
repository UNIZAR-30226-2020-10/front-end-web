import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public friendService: FriendsService,
    public cloudService: CloudService,
    public audioService: AudioService
  ) { }

  ngOnInit(): void {
  }

}
