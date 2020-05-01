import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor(
    public cloudService: CloudService
  ) { }

  ngOnInit() {}

}
