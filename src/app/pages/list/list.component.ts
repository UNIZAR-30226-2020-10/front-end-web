import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  list;
  queue: Boolean;
  search: Boolean;
  song;
  add: Boolean;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.queue = this.route.snapshot.data['queue'];
    this.search = this.route.snapshot.data['search'];
    this.add = this.route.snapshot.data['add'];
    this.route.paramMap.subscribe(params => {
      if(this.queue) {
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":null};
      } else if(this.search) {
        this.list = {"Canciones":[],
                     "Nombre":"Búsqueda", "ID":'', "Desc":"Búsqueda", "Imagen":null};
        this.list.Canciones = this.cloudService.searchSong(params.get('id')).subscribe(list => this.list.Canciones = list);
      } else if(this.add) {
        this.list = undefined;
        this.song = this.audioService.passSong;
      } else {
        this.list = this.cloudService.getList(params.get('id')).subscribe(list => this.list = list);
      }
    });
   }

  addToList(list) {
    if(list == 'c') {
      this.audioService.addToQueue(this.song);
    } else {
      this.cloudService.addSong(this.song.ID, list);
    }
    this.backToList();
  }

  removeFromList(song, index, list) {
    if(list != 'c') {
      this.cloudService.deleteSong(song.ID, list);
    } else {
      this.audioService.deleteFromQueue(index);
    }
  }

  addToPlaylist(song) {
    this.song = song;
    this.add = true;
  }

  backToList() {
    this.song = undefined;
    if(this.list == undefined) {
      this.audioService.passSong = undefined;
      this.location.back();
    } else {
      this.add = false;
    }
  }

  loadList(index, song) {
    if(this.search) {
      this.audioService.loadList([song], 0, undefined);
    } else {
      this.audioService.loadList(this.list.Canciones, index, this.list.ID);
    }
  }

  isActual(i) {
    if(this.queue && this.audioService.currentFile.index === i &&
       !this.audioService.checkState().error) {
      return "actual";
    }
    return "";
  }

  ngOnInit() {

  }

}
