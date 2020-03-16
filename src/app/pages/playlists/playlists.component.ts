import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: Array<ListComponent> = [];

  constructor( ) { }

  ngOnInit(): void {
  }

}
