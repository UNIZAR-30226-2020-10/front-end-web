import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavePodcastService {

  private podcast;
  private last_state;
  private title_string
  idComp;

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

  restoreTitle(){
    return this.title_string;
  }

  saveState(state, title){
    this.last_state = state;
    this.title_string = title;
  }
}
