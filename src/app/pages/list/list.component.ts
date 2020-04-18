import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  checkoutForm;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
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
        this.cloudService.searchSong(params.get('id')).subscribe(list => this.list.Canciones = list);
      } else if(this.add) {
        this.list = undefined;
        this.song = this.audioService.passSong;
        this.loadPlaylists();
      } else {
        this.cloudService.getList(params.get('id')).subscribe(list => this.list = list);
      }
    });
   }

  returnBack() {
    if(this.list == undefined || this.queue) {
      this.audioService.showSong = true;
    }
    this.location.back();
  }

  addToList(list) {
    if(list == 'c') {
      this.audioService.addToQueue(this.song);
    } else {
      this.cloudService.addSong(this.song.ID, list);
    }
    this.backToList();
  }

  async removeFromList(song, index, list) {
    if(list != 'c') {
      await this.cloudService.deleteSong(song.ID, list);
      this.cloudService.getList(list).subscribe(aux => this.list = aux);
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
    this.add = false;
    if(this.list == undefined) {
      this.audioService.passSong = undefined;
      this.returnBack();
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

  async onSubmit(title) {
    this.checkoutForm.reset();
    await this.cloudService.createList(title.titulo);
    this.loadPlaylists();
  }

  drop(event: CdkDragDrop<string[]>) {
    if(this.queue) {
      moveItemInArray(this.audioService.audioList, event.previousIndex, event.currentIndex);
      console.log("ACTUAL CANCION: ", this.audioService.currentFile.index);
      console.log("INDICE CANCION A MOVER: ", event.previousIndex);
      if(this.audioService.currentFile.index == event.previousIndex) {
        console.log("NUEVO INDICE: ", event.currentIndex);
        this.audioService.currentFile.index = event.currentIndex;
      } else if(this.audioService.currentFile.index <= event.currentIndex &&
                this.audioService.currentFile.index > event.previousIndex){
        this.audioService.currentFile.index--;
      } else if(this.audioService.currentFile.index >= event.currentIndex &&
                this.audioService.currentFile.index < event.previousIndex){
        this.audioService.currentFile.index++;
      }
    }
  }

  async loadPlaylists() {
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

  ngOnInit() {

  }

}
