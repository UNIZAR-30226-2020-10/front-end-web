import { Injectable } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SavePodcastService {

  podcast; 
  last_state;

  constructor() { }

  save(pod){
    this.podcast = pod;
  }

  get(){
    return this.podcast;
  }

  restoreState(){
    if (this.last_state != null){
      return this.last_state;
    }
  }

  saveState(state){
    this.last_state = state;
  }
}
