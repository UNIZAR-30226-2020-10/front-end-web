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
    this.audioService.lists = this.cloudService.getPlaylists().subscribe(lists => this.audioService.lists = lists);
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

   onSubmit(title){
    this.cloudService.createList(title.titulo);
    this.audioService.lists = this.cloudService.getPlaylists().subscribe(lists => this.audioService.lists = lists);
    this.checkoutForm.reset();
  }

  favorite(type) {
    if(type == 'Favoritas') {
      return "favorite"
    }
    return "";
  }

  ngOnInit(): void { }

}
