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

  constructor(
    public audioService: AudioService,
    private formBuilder: FormBuilder,
    public cloudService: CloudService
  ) {
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  async onSubmit(title) {
    this.checkoutForm.reset();
    await this.cloudService.createList(title.titulo);
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

  favorite(type) {
    if(type == 'Favoritas') {
      return "favorite"
    }
    return "";
  }

  async deleteList(id) {
    await this.cloudService.deleteList(id);
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

  async ngOnInit() {
    this.audioService.lists = await this.cloudService.getPlaylists();
  }

}
