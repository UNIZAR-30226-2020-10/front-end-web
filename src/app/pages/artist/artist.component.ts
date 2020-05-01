import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  info;
  saved: boolean;

  constructor(
    private route: ActivatedRoute,
    public cloudService: CloudService
  ) { }

  async ngOnInit(){
    var id = "";
    this.route.paramMap.subscribe( params => {
      id = params.get('id');
    });
    this.info = await this.cloudService.infoArtist(id);
  }

  toggleIcon() {
    this.saved = !this.saved;
   }

}
