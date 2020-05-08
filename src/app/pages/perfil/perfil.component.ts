import { Component, OnInit } from '@angular/core';
import { CloudService } from 'src/app/services/cloud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user;

  constructor(
    public cloudService: CloudService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    var aux;
    this.route.paramMap.subscribe(params => {
      aux = this.cloudService.decrypt(params.get('id'));
    });
    if(aux === this.user) {
      this.user = this.cloudService.userInfo;
    } else {
      this.user = await this.cloudService.infoUser(aux);
    }
    this.user.Email = aux;
  }

}
