import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  private pos;
  info;
  subscribed: Boolean;
  saved: boolean;

  constructor(
    private route: ActivatedRoute,
    public cloudService: CloudService,
    public audioService: AudioService
  ) { }

  async ngOnInit(){
    var id = "";
    this.route.paramMap.subscribe( params => {
      id = params.get('id');
    });
    this.info = await this.cloudService.infoArtist(id);
    this.pos = this.audioService.artistSubscribed(this.info);
    this.subscribed = (this.pos >= 0 ? true : false);
  }

  async subscribe() {
    if(this.subscribed) {
      await this.cloudService.unsubscribe(this.info.Nombre);
      this.audioService.subscribeArtists.splice(this.pos, 1);
    } else {
      await this.cloudService.subscribe(this.info.Nombre);
      this.pos = this.audioService.subscribeArtists.length;
      this.audioService.subscribeArtists.push(this.info);
    }
    this.subscribed = !this.subscribed;
  }

  toggleIcon() {
    this.saved = !this.saved;
   }

}
