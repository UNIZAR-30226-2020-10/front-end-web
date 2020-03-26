import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StreamState } from '../stream-state';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private start: Boolean = false;
  loop: Boolean = false;
  maxIndex:  number = 0;
  currentFile: any = {};
  audioList: Array<any> = [];
  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart'
  ];

  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
      case 'ended':
        if(this.currentFile.index + 1 >= this.maxIndex && !this.loop) {
          this.start = true;
        }
        this.next();
        break;
    }
    this.stateChange.next(this.state);
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  checkState() {
    return this.state;
  }

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
    };
  }

  private streamObservable(url) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      if(this.start) {
        this.start = false;
      } else {
        this.audioObj.play();
      }

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  loadSong(song, index) {
    this.currentFile = { index, song };
    this.stop();
  }

  openFile(song, index) {
    this.loadSong(song, index);
    this.playStream(song.url).subscribe(events => { });
  }

  previous() {
    var index = this.currentFile.index - 1;
    if(index < 0) {
      index = this.maxIndex - 1;
    }
    this.openFile(this.audioList[index], index);
  }

  next() {
    var index = this.currentFile.index + 1;
    if(index >= this.maxIndex) {
      index = 0;
    }
    this.openFile(this.audioList[index], index);
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  loadList(files, song, index) {
    this.audioList = files;
    this.maxIndex = files.length;
    this.openFile(song, index);
  }

  equals(files) {
    if(this.audioList.length != files.length) {
      return false;
    }
    for (let index = 0; index < this.audioList.length; index++) {
      if(this.audioList[index] != files[index]) {
        return false;
      }
    }
    return true;
  }

  openPodcast(url, name, creator) {
    this.maxIndex = 1;
    var song = {
      url: url,
      name: name,
      artist: creator
    };
    this.audioList[0] = song;
    this.loadSong(song, 0);
    this.playStream(song.url).subscribe(events => { });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }
}
