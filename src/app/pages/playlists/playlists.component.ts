import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FormBuilder } from '@angular/forms';
import { CloudService } from 'src/app/services/cloud.service';

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
    public cloudService: CloudService
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
    this.searchList = this.formBuilder.group({
      titulo: ''
    });
  }

  async onSubmit(title) {
    this.checkoutForm.reset();
    const msg = await this.cloudService.createList(title.titulo);
    console.log(msg);
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

  onSearch(title) {
    this.found = [];
    for(let list of this.audioService.lists) {
      if(list.Nombre.toLowerCase().includes(title.titulo.toLowerCase())) {
        this.found.push(list);
      }
    }
  }

  playlists() {
    if(this.found.length != 0) {
      console.log("busqueda");
      return this.found;
    }
    console.log("normal");
    return this.audioService.lists;
  }

  favorite(type) {
    if(type == 'Favoritas') {
      return "favorite"
    }
    return "";
  }

  async deleteList(id) {
    const msg = await this.cloudService.deleteList(id);
    console.log(msg);
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

  async ngOnInit() {
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

}
