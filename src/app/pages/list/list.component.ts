import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  list;
  queue: Boolean;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      if(params.get('id') == '0') {
        this.list = this.cloudService.getFiles();
        this.queue = false;
      } else if(params.get('id') == 'c') {
        this.queue = true;
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":null};
      } else {
        this.queue = false;
        this.list = this.cloudService.getList(params.get('id')).subscribe(list => this.list = list);
      }
    });
   }

  addToList(song, index, list) {
    if(list == 'c') {
      this.audioService.addToQueue(song);
    } else {
      this.cloudService.addSong(this.audioService[index], list);
    }
  }

  removeFromList(song, index, list) {
    if(list != 'c') {
      this.cloudService.deleteSong(song, list);
    }
    this.audioService.deleteFromQueue(index);
  }

  ngOnInit() {

  }

}
