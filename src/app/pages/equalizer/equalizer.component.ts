import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss']
})
export class EqualizerComponent implements OnInit {

  constructor(
    public audioService: AudioService
  ) { }

  changeEqualizer(change, index){
    this.audioService.changeEqualizer(change.value, index);
  }

  ngOnInit(): void {
  }

}
