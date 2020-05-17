import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FormBuilder } from '@angular/forms';
import { CloudService } from 'src/app/services/cloud.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  checkoutForm;
  searchList;
  found: any = [];

  constructor(
    public audioService: AudioService,
    private formBuilder: FormBuilder,
    public cloudService: CloudService,
    public alertService: AlertsService
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
    this.searchList = this.formBuilder.group({
      titulo: ''
    });
  }

  async onSubmit(title) {
    if(title.titulo.trim().length === 0) {
      this.alertService.showAlert(2, "", "Introduce un nombre para la lista");
      return;
    }
    this.checkoutForm.reset();
    const msg = await this.cloudService.createList(title.titulo.trim());
    if(msg === "No favoritos") {
      this.alertService.showAlert(0, "", "No se permite crear una lista con el nombre introducido");
    } else if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.audioService.lists = await this.cloudService.getPlaylists(this.cloudService.user);
      this.alertService.showAlert(1, "", "Se ha creado la lista " + title.titulo.trim());
    }
  }

  onSearch(title) {
    this.found = [];
    for(let list of this.audioService.lists) {
      if(list.Nombre.toLowerCase().includes(title.titulo.toLowerCase())) {
        this.found.push(list);
      }
    }
    if(this.found.length === 0) {
      this.alertService.showAlert(2, "", "No se ha encontrado ninguna lista");
    }
  }

  playlists() {
    if(this.found.length != 0) {
      return this.found;
    }
    return this.audioService.lists;
  }

  favorite(type) {
    if(type == 'Favoritos') {
      return "favorite"
    }
    return "";
  }

  async deleteList(id, name, i) {
    const msg = await this.cloudService.deleteList(id);
    if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.audioService.lists.splice(i, 1);
      this.alertService.showAlert(1, "", "La lista " + name + " se ha eliminado");
    }
  }

  ngOnInit() { }

}
