import { Component, OnInit, Input } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.scss']
})
export class PodcastDetailComponent implements OnInit {

  @Input() result: Array<any>;

  // Variables

  constructor(
    public audioService: AudioService
  ) { }

  ngOnInit(): void {
  }

  onPlay(): void {
    this.audioService.openPodcast(this.result[0].audio, this.result[0].title, this.result[1]);
  }

  stripHTML(text) {
    return text.replace(/<.*?>/gm, '');
   }
}
