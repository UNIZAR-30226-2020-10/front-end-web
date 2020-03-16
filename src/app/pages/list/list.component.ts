import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  files: Array<any> = [];
  name: string = "example";

  constructor(
    public cloudService: CloudService,
    private route: ActivatedRoute
  ) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name');
    });
  }

}
