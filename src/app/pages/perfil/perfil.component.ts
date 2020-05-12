import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user;
  playlists;

  constructor(
    public cloudService: CloudService,
    private route: ActivatedRoute,
    private audioService: AudioService
  ) {
    this.route.paramMap.subscribe(async params => {
      var aux = this.cloudService.decrypt(params.get('id'));
      if(aux === this.cloudService.user) {
        this.user = this.cloudService.userInfo;
        this.playlists = this.audioService.lists;
      } else {
        this.user = await this.cloudService.infoUser(aux);
        this.playlists = await this.cloudService.getPlaylists(aux);
      }
      this.user.Email = aux;
    });
  }

  ngOnInit() { }

}
