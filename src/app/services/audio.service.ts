import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StreamState } from '../stream-state';
import * as moment from 'moment';
import { PodcastService } from './podcast.service';
import { MatTableDataSource } from '@angular/material/table';
declare const changeVolume: any;
declare const checkVolume: any;

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private start: Boolean = false;
  notifPodcast;
  listID = null;
  oldAudioList: Array<any> = [];
  showFavorite: Boolean = false;
  categories;
  subscribeArtists;
  passSong;
  volume;
  showSong: Boolean = false;
  loop: Boolean = false;
  lists: any = [];
  favoriteID;
  favoritePodcasts;
  favoriteSongs: Array<any> = [];
  songFav: Boolean;
  maxIndex:  number = 0;
  currentFile: any = {};
  audioList: Array<any> = [];
  dataSource;
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

  constructor(
    private podcastService: PodcastService
  ) { }

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
        if(this.currentFile.song.title) {
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
        if(this.currentFile.song.title) {
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
    this.songFav = this.songFavorite(this.currentFile.song);
    this.playStream(song.URL).subscribe(events => { });
  }

  openPodcast(url, id, name, creator, t, img, pid) {
    this.maxIndex = 1;
    var song = {
      URL: url,
      Nombre: name,
      Artistas: [creator],
      Imagen: img,
      ID: id,
      Album: undefined,
      title: t,
      Categorias: ["Podcast"],
      PID: pid
    };
    this.audioList = [];
    this.audioList[0] = song;
    this.loadSong(song, 0);
    this.songFav = this.songFavorite(this.currentFile.song);
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
    this.oldAudioList = [];
    if(load === 'g') {
      if((files.Cancion && files.Cancion != null) || files.Canciones) {
        var i = 0;
        if(files.Canciones) {
          this.listID = files.ID;
          this.audioList = Array.from(files.Canciones);
          this.maxIndex = this.audioList.length;
          while(this.audioList[i].ID != index.ID) {
            ++i;
          }
        } else {
          this.audioList = Array.from(files.Cancion);
          this.maxIndex = 1;
          this.listID = null;
        }
        this.start = true;
        this.openFile(this.audioList[i], i);
        if(!files.Canciones) {
          this.seekTo(files.Segundo);
        }
      }
      return;
    } else if(load != 'c') {
      this.listID = load;
      this.loop = false;
      this.audioList = Array.from(files);
      this.maxIndex = this.audioList.length;
    } else {
      this.listID = null;
    }
    this.openFile(this.audioList[index], index);
  }

  changeVol(val) {
    changeVolume(this.audioObj, val);
  }

  checkVol() {
    return checkVolume(this.audioObj);
  }

  mute() {
    if(this.checkVol() === 0) {
      this.changeVol(this.volume);
    } else {
      this.volume = this.checkVol();
      this.changeVol(0);
    }
  }

  random() {
    if(this.oldAudioList.length === 0) {
      this.oldAudioList = Array.from(this.audioList);
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
    } else {
      this.audioList = Array.from(this.oldAudioList);
      this.oldAudioList = [];
      var i = 0;
      while(this.audioList[i].ID != this.currentFile.song.ID) {
        ++i;
      }
      this.loadSongNoStop(this.audioList[i], i);
    }
  }

  addToQueue(song) {
    this.oldAudioList = [];
    this.listID = null;
    this.audioList[this.maxIndex++] = song;
  }

  deleteFromQueue(index) {
    this.oldAudioList = [];
    this.listID = null;
    var actual = false;
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
      this.currentFile = {};
    } else if(actual) {
      this.openFile(this.audioList[index], index);
    }
  }

  songFavorite(fav) {
    if(fav.title && this.favoritePodcasts) {
      for(let song of this.favoritePodcasts) {
        if(song.title === fav.title) {
          return true;
        }
      }
    } else {
      for(let song of this.favoriteSongs) {
        if(song.ID === fav.ID) {
          return true;
        }
      }
    }
    return false;
  }

  artistSubscribed(artist) {
    let i = 0;
    for(let art of this.subscribeArtists) {
      if(art.Nombre === artist.Nombre) {
        return i;
      }
      ++i;
    }
    return -1;
  }

  myList(list) {
    for(let l of this.lists) {
      if(l.ID === list.ID) {
        return true;
      }
    }
    return false;
  }

  addToFav(song) {
    this.favoriteSongs.push(song);
  }

  dropFav(index) {
    this.favoriteSongs.splice(index,1);
  }

  favList(list) {
    this.favoriteSongs = list.Canciones;
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

  idsPodcasts(ids) {
    var aux = "";
    if(ids.length > 0) {
      aux = ids[0];
      ids.shift();
      for(let id of ids) {
        aux += "," + id;
      }
    }
    if(aux.length > 0) {
      this.favoritePodcasts = [];
      var splitted = aux.split(",");
      for(let s of splitted) {
        this.podcastService.getEpisodes(s).subscribe(podcast => this.favoritePodcasts.push(podcast));
      }
    } else {
      this.favoritePodcasts = undefined;
    }
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
