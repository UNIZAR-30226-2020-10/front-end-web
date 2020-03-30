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

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute
  ) {

    // get media files
    /*cloudService.getFiles().subscribe(files => {
      this.files = files;
    });*/
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('x'));
      this.list = this.cloudService.getList(params.get('id')).subscribe(list => this.list = list);
    });
  }

}
