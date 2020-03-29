import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  lists;

  constructor(
    public cloudService: CloudService
  ) {
    this.lists = this.cloudService.getPlaylists().subscribe(lists => this.lists = lists);
   }

  ngOnInit(): void { }

}
