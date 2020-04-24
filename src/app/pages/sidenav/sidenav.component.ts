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
  change: string;
  checkoutForm;

  constructor(
    public audioService: AudioService,
    private formBuilder: FormBuilder,
    private router: Router,
    public cloudService: CloudService
  ) {
    this.change = 'change-right';
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
  }

  changeStyle() {
    if(this.change == 'change-right') {
      this.change = 'change-left';
    } else {
      this.change = 'change-right';
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
