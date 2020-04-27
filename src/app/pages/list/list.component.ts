import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertsService } from 'src/app/services/alerts.service';

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
    private location: Location,
    public alertService: AlertsService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
    this.queue = this.route.snapshot.data['queue'];
    this.search = this.route.snapshot.data['search'];
    this.add = this.route.snapshot.data['add'];
    this.route.paramMap.subscribe(async params => {
      if(this.queue) {
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":null};
        if(this.list.Canciones === [] || this.list === undefined) {
          this.alertService.showAlert(3, "", "Cola vacía");
        }
      } else if(this.search) {
        this.list = {"Canciones": [],
                     "Nombre":"Búsqueda", "ID":'', "Desc":"Búsqueda", "Imagen":null};
        console.log(params.get('id'));
        this.list.Canciones = await this.cloudService.searchSong(params.get('id'));
        console.log(this.list);
        if(this.list.Canciones === undefined || this.list.Canciones === []) {
          this.alertService.showAlert(3, "", "No se han encontrado canciones");
        } else {
          var n = this.list.Canciones.length;
          if(n === 1) {
            this.alertService.showAlert(1, "", "Se ha encontrado una canción");
          } else {
            this.alertService.showAlert(1, "", "Se han encontrado " + n + " canciones");
          }
        }
      } else if(this.add) {
        this.list = undefined;
        this.song = this.audioService.passSong;
        this.audioService.lists = await this.cloudService.getPlaylists();
      } else {
        this.list = await this.cloudService.getList(params.get('id'));
        console.log(this.list);
        if(this.list.Canciones === undefined || this.list.Canciones === []) {
          this.alertService.showAlert(3, "", "Lista vacía");
        }
        console.log(this.list);
      }
    });
  }

  async addToList(list, name) {
    if(list == 'c') {
      this.audioService.addToQueue(this.song);
      this.alertService.showAlert(1, "", "Canción añadida a la cola");
    } else {
      const msg = await this.cloudService.addSong(this.song.ID, list);
      if(msg === 'Success') {
        this.alertService.showAlert(1, "", "Canción añadida a la lista " + name);
      } else {
        this.alertService.showAlert(0, "", "No se ha podido añadir una canción a la lista " + name);
      }
    }
    this.backToList();
  }

  async removeFromList(song, index, list) {
    var pr = "";
    if(list != 'c') {
      await this.cloudService.deleteSong(song.ID, list);
      this.list = await this.cloudService.getList(list);
      pr = "lista " + this.list.Nombre;
    } else {
      this.audioService.deleteFromQueue(index);
      pr = "cola";
      if(this.audioService.maxIndex === 0) {
        this.router.navigateByUrl('/initial-screen');
      }
    }
    this.alertService.showAlert(1, "", "Canción eliminada de la " + pr);
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
      this.audioService.showSong = true;
      this.location.back();
    }
  }

  loadList(index, song) {
    if(this.search) {
      this.audioService.loadList([song], 0, undefined);
    } else {
      console.log(index);
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
    const msg = await this.cloudService.createList(title.titulo);
    if(msg === "No favoritos") {
      this.alertService.showAlert(0, "", "No se permite crear una lista con el nombre introducido");
    } else if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.audioService.lists = await this.cloudService.getPlaylists();
      this.alertService.showAlert(1, "", "Se ha creado la lista " + title.titulo);
    }
  }

  async drop(event: CdkDragDrop<string[]>) {
    if(this.queue) {
      moveItemInArray(this.audioService.audioList, event.previousIndex, event.currentIndex);
      if(this.audioService.currentFile.index == event.previousIndex) {
        this.audioService.currentFile.index = event.currentIndex;
      } else if(this.audioService.currentFile.index <= event.currentIndex &&
                this.audioService.currentFile.index > event.previousIndex){
        this.audioService.currentFile.index--;
      } else if(this.audioService.currentFile.index >= event.currentIndex &&
                this.audioService.currentFile.index < event.previousIndex){
        this.audioService.currentFile.index++;
      }
    } else if(!this.search && !this.add) {
      console.log(this.list.Canciones);
      moveItemInArray(this.list.Canciones, event.previousIndex, event.currentIndex);
      console.log(this.list.Canciones);
      await this.cloudService.move(this.list.ID, event.previousIndex, event.currentIndex);
    }
  }

  ngOnInit() { }

}
