import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

  saved: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  toggleIcon() {
    this.saved = !this.saved;
   }

}
