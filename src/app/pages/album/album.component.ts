import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

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
    public cloudService: CloudService,
    public audioService: AudioService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('id');
    });
    this.songs = await this.cloudService.infoAlbum(this.name);
    console.log(this.songs);
  }

}
