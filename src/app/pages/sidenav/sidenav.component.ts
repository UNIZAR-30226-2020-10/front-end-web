import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  checkoutForm;

  constructor(
    public audioService: AudioService,
    private formBuilder: FormBuilder,
    private router: Router,
    public cloudService: CloudService
  ) {
    console.log(this.cloudService.user);
    if(this.cloudService.user == undefined) {
      this.cloudService.change = 'nothing';
    } else {
      this.cloudService.change = 'change-right';
    }
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  changeStyle() {
    console.log(this.cloudService.user);
    if(this.cloudService.user == undefined) {
      this.cloudService.change = 'nothing';
    } else if(this.cloudService.change == 'change-right') {
      this.cloudService.change = 'change-left';
    } else {
      this.cloudService.change = 'change-right';
    }
  }

  onSubmit(title){
    if(title.titulo.length > 2) {
      this.router.navigate(['/search', title.titulo]);
      this.checkoutForm.reset();
    }
  }

  ngOnInit(): void {
  }

}
