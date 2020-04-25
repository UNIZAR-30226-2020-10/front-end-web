import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StreamState } from '../stream-state';
import * as moment from 'moment';
declare const changeVolume: any;
declare const checkVolume: any;
declare const equalizerLoad: any;
declare const equalizer: any;
declare const valEqualizer: any;
declare const quitEqualizer: any;

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private start: Boolean = false;
  private isPodcast: Boolean = false;
  private listID;
  passSong;
  useEqualizer: Boolean = false;
  showSong: Boolean = false;
  loop: Boolean = false;
  lists: any = [];
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
        if(this.isPodcast) {
          this.state.readableDuration = this.formatTimePodcast(this.state.duration);
        } else {
          this.state.readableDuration = this.formatTimeSong(this.state.duration);
        }
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
        if(this.isPodcast) {
          this.state.readableCurrentTime = this.formatTimePodcast(this.state.currentTime);
        } else {
          this.state.readableCurrentTime = this.formatTimeSong(this.state.currentTime);
        }
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
      if(this.useEqualizer && !this.isPodcast) {
        equalizerLoad(this.audioObj);
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

  stops() {
    this.seekTo(0);
    this.pause();
  }

  stop() {
    this.stop$.next();
  }

  loadSong(song, index) {
    this.currentFile = { index, song };
    this.stop();
  }

  loadSongNoStop(song, index) {
    this.currentFile = { index, song };
  }

  openFile(song, index) {
    this.loadSong(song, index);
    this.playStream(song.URL).subscribe(events => { });
  }

  openPodcast(url, name, creator) {
    this.isPodcast = true;
    this.maxIndex = 1;
    var song = {
      URL: url,
      Nombre: name,
      Artistas: [creator],
      Imagen: null,
      ID: undefined,
      Album: undefined
    };
    this.audioList = [];
    this.audioList[0] = song;
    this.loadSong(song, 0);
    this.playStream(song.URL).subscribe(events => { });
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

  formatTime(time: number, format: string) {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  formatTimeSong(time: number, format: string = 'mm:ss') {
    return this.formatTime(time, format);
  }

  formatTimePodcast(time: number, format: string = 'HH:mm:ss') {
    return this.formatTime(time, format);
  }

  loadList(files, index, load) {
    this.isPodcast = false;
    if(load != 'c') {
      this.listID = load;
      this.loop = false;
      this.audioList = Array.from(files);
      this.maxIndex = this.audioList.length;
    }
    this.openFile(this.audioList[index], index);
  }

  changeVol(val) {
    changeVolume(this.audioObj, val);
  }

  checkVol() {
    return checkVolume(this.audioObj);
  }

  random() {
    var currentIndex = this.maxIndex, aux, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      aux = this.audioList[currentIndex];
      this.audioList[currentIndex] = this.audioList[randomIndex];
      this.audioList[randomIndex] = aux;
    }
    for (let index = 0; index < this.maxIndex; index++) {
      if(this.audioList[index].URL === this.currentFile.song.URL) {
        aux = this.audioList[index];
        this.audioList[index] = this.audioList[0];
        this.audioList[0] = aux;
        break;
      }
    }
    this.loadSongNoStop(this.audioList[0], 0);
  }

  loadEqualizer(){
    this.useEqualizer = true;
    equalizerLoad(this.audioObj);
  }

  stateEqualizer(index) {
    return valEqualizer(index);
  }

  changeEqualizer(val, index) {
    equalizer(val, index);
  }

  exitEqualizer() {
    quitEqualizer();
  }

  addToQueue(song) {
    this.audioList[this.maxIndex++] = song;
  }

  deleteFromQueue(index) {
    var actual = false;
    console.log(this.currentFile.index);
    console.log(index);
    if(this.currentFile.index == index) {
      actual = true;
    }
    if(this.currentFile.index > index) {
      --this.currentFile.index;
    }
    this.audioList.splice(index,1);
    this.maxIndex--;
    if(this.maxIndex == 0) {
      this.pause();
    } else if(actual) {
      this.openFile(this.audioList[index], index);
    }
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
