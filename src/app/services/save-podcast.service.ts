import { Injectable } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SavePodcastService {

  private podcast;
  private last_state;
  private title_string

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
    console.log("SAVE_PODCAST");
    console.log(this.title_string);
    console.log(this.last_state);
  }
}
