import { Component, OnInit, Input } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.scss']
})
export class PodcastDetailComponent implements OnInit {

  @Input() result;

  // Variables

  constructor(
    public audioService: AudioService
  ) { }

  ngOnInit(): void {
  }
}
