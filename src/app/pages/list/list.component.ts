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
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('id'));
      if(params.get('id') == '0') {
        this.list = this.cloudService.getFiles();
        this.queue = false;
        console.log("LISTA DEBUG");
      } else if(params.get('id') == 'c') {
        this.queue = true;
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":null};
        console.log("COLA DE REPRODUCCION");
      } else {
        this.queue = false;
        this.list = this.cloudService.getList(params.get('id')).subscribe(list => this.list = list);
        console.log("LISTA DE BACKEND");
      }
    });
  }

}
