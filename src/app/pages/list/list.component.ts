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
  search: Boolean;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute
  ) {
    this.queue = this.route.snapshot.data['queue'];
    this.search = this.route.snapshot.data['search'];
    this.route.paramMap.subscribe(params => {
      if(params.get('id') == '0') {
        this.list = this.cloudService.getFiles();
      } else if(this.queue) {
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":null};
        console.log(this.list.Canciones);
      } else if(this.search){
        this.list = {"Canciones":[],
                     "Nombre":"Búsqueda", "ID":5432, "Desc":"Búsqueda", "Imagen":null};
        this.list.Canciones = this.cloudService.searchSong(params.get('id')).subscribe(list => this.list.Canciones = list);
      } else {
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
    } else {
      this.audioService.deleteFromQueue(index);
    }
  }

  ngOnInit() {

  }

}
