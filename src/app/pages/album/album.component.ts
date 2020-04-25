import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  name: String;
  songs;

  constructor(
    private route: ActivatedRoute,
    public cloudService: CloudService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('id');
    });
    this.songs = this.cloudService.searchSong(this.name);
  }

}
