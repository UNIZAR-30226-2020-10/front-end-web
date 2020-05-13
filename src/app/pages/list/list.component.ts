import { Component, OnInit } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertsService } from 'src/app/services/alerts.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  orderArtist = 0;
  orderTitle = 0;
  private orderCategory: Boolean = false;
  tableColumns: string[] = ['Imagen', 'Nombre', 'Artista', 'Categoría', 'Botones'];
  searchAlbum: string[] = ['Imagen', 'Nombre', 'Artista', 'Fecha'];
  searchArtist: string[] = ['Imagen', 'Nombre', 'Pais'];
  tableAdd: string[] = ['Imagen', 'Nombre'];
  list;
  playlists;
  filter;
  queue: Boolean;
  search: Boolean;
  song;
  add: Boolean;
  category: Boolean;
  checkoutForm;
  searchList;
  categories;
  hover = "";

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    public alertService: AlertsService,
    public router: Router,
    private loader: LoaderService
  ) {
    this.categories = [];
    for(let cat of this.audioService.categories) {
      this.categories.push({name: cat.Nombre, checked: false });
    }
    this.categories.push({name: 'Podcast', checked: false });
    this.checkoutForm = this.formBuilder.group({
      titulo: ''
    });
    this.searchList = this.formBuilder.group({
      titulo: ''
    });
    this.queue = this.route.snapshot.data['queue'];
    this.search = this.route.snapshot.data['search'];
    this.add = this.route.snapshot.data['add'];
    this.category = this.route.snapshot.data['category'];
    this.route.paramMap.subscribe(async params => {
      if(this.queue) {
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reprodución",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":"default"};
        if(this.list.Canciones === [] || this.list === undefined) {
          this.alertService.showAlert(3, "", "Cola vacía");
        }
      } else if(this.search) {
        this.list = await this.cloudService.searchSong(params.get('id'));
        if(this.list.Canciones.length === 0 && this.list.Albums.length === 0 && this.list.Artistas.length === 0) {
          this.alertService.showAlert(3, "", "No se ha encontrado ninguna coincidencia");
        }
      } else if(this.add) {
        this.list = undefined;
        this.newAdd();
        this.song = this.audioService.passSong;
      } else if(this.category) {
        this.list = {"Canciones": await this.cloudService.categories([params.get('id')]),
                     "Nombre":params.get('id'), "ID":'', "Desc":params.get('id'), "Imagen":"default"};
      } else {
        const id = parseInt(this.cloudService.decrypt(params.get('id')));
        this.list = await this.cloudService.getList(id);
        if(id === this.audioService.favoriteID) {
          this.list.Canciones = this.audioService.favoriteSongs;
        }
        if(this.list.Canciones.length === 0) {
          this.alertService.showAlert(3, "", "Lista vacía");
        }
      }
    });
  }

  async addToList(list, name) {
    if(list == 'c') {
      if(!this.audioService.checkState().playing) {
        this.audioService.loadList([this.song], 0, undefined);
      } else {
        this.audioService.addToQueue(this.song);
      }
      this.alertService.showAlert(1, "", "Canción añadida a la cola");
    } else {
      const msg = await this.cloudService.addSong(this.song.ID, list);
      if(msg === 'Success') {
        this.alertService.showAlert(1, "", "Canción añadida a la lista " + name);
        if(list === this.audioService.favoriteID) {
          this.audioService.addToFav(this.song);
          if(this.song.ID === this.audioService.currentFile.song.ID) {
            this.audioService.songFav = true;
          }
        }
      } else {
        this.alertService.showAlert(0, "", "No se ha podido añadir la canción a la lista " + name);
      }
    }
    this.backToList();
  }

  async removeFromList(song, list) {
    var pr = "", index;
    if(list != 'c') {
      await this.cloudService.deleteSong(song.ID, list);
      if(list === this.audioService.favoriteID) {
        index = this.audioService.favoriteSongs.map(function(el) { return el.ID; }).indexOf(song.ID);
        this.audioService.dropFav(index);
        if(song.ID === this.audioService.currentFile.song.ID) {
          this.audioService.songFav = false;
        }
      } else {
        index = this.list.Canciones.map(function(el) { return el.ID; }).indexOf(song.ID);
        this.list = this.list.splice(index, 1);
      }
      pr = "lista " + this.list.Nombre;
    } else {
      index = this.audioService.audioList.map(function(el) { return el.ID; }).indexOf(song.ID);
      this.audioService.deleteFromQueue(index);
      pr = "cola";
      if(this.audioService.maxIndex === 0) {
        this.router.navigateByUrl('/initial-screen');
      }
    }
    this.alertService.showAlert(1, "", song.Nombre + " ha sido eliminada de la " + pr);
  }

  newAdd() {
    this.playlists = Array.from(this.audioService.lists);
    this.playlists.unshift({"Canciones":'',"Nombre":"Cola de reprodución", "ID":'c', "Desc":"Cola de reproducción", "Imagen":"https://psoftware.s3.amazonaws.com/LogoAppFondoEscalaGrises.png"});
  }

  addToPlaylist(song) {
    this.newAdd();
    this.song = song;
    this.add = true;
  }

  backToList() {
    this.song = undefined;
    this.add = false;
    delete this.playlists;
    if(this.list === undefined) {
      this.audioService.passSong = undefined;
      this.audioService.showSong = true;
      this.location.back();
    }
  }

  loadList(index, song) {
    if(this.search && song != "all") {
      this.audioService.loadList([song], 0, undefined);
    } else {
      this.audioService.loadList(this.isFilter(), index, this.list.ID);
    }
  }

  async onSubmit(title) {
    this.checkoutForm.reset();
    const msg = await this.cloudService.createList(title.name);
    if(msg === "No favoritos") {
      this.alertService.showAlert(0, "", "No se permite crear una lista con el nombre introducido");
    } else if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.audioService.lists = await this.cloudService.getPlaylists(this.cloudService.user);
      this.alertService.showAlert(1, "", "Se ha creado la lista " + title.titulo);
    }
  }

  async drop(event: CdkDragDrop<string[]>) {
    if(this.queue) {
      moveItemInArray(this.audioService.audioList, event.previousIndex, event.currentIndex);
      if(this.audioService.currentFile.index == event.previousIndex) {
        this.audioService.currentFile.index = event.currentIndex;
      } else if(this.audioService.currentFile.index <= event.currentIndex &&
                this.audioService.currentFile.index > event.previousIndex){
        this.audioService.currentFile.index--;
      } else if(this.audioService.currentFile.index >= event.currentIndex &&
                this.audioService.currentFile.index < event.previousIndex){
        this.audioService.currentFile.index++;
      }
    } else if(!this.search && !this.add) {
      console.log(this.list.Canciones);
      if(this.list.ID === this.audioService.favoriteID) {
        moveItemInArray(this.audioService.favoriteSongs, event.previousIndex, event.currentIndex);
      } else {
        moveItemInArray(this.list.Canciones, event.previousIndex, event.currentIndex);
      }
      this.loader.necessary = false;
      await this.cloudService.move(this.list.ID, event.previousIndex, event.currentIndex);
      this.loader.necessary = true;
    }
  }

  onSearch(title) {
    var chosen;
    if(this.audioService.favoriteID != this.list.ID) {
      chosen = new Array(this.list.Canciones.length);
      chosen = Array.from(this.list.Canciones);
    } else {
      chosen = new Array(this.audioService.favoriteSongs.length);
      chosen = Array.from(this.audioService.favoriteSongs);
    }
    this.filter = [];
    for(let song of chosen) {
      if(song.Nombre.toLowerCase().includes(title.titulo.toLowerCase())) {
        this.filter.push(song);
      } else {
        for(let artist of song.Artistas) {
          if(artist.toLowerCase().includes(title.titulo.toLowerCase())) {
            this.filter.push(song);
            break;
          }
        }
      }
    }
    if(this.filter.length === 0) {
      this.alertService.showAlert(2, "", "No se ha encontrado ninguna canción");
    } else {
      if(this.orderCategory) {
        this.byCategory(this.filter);
      }
      if(this.orderTitle === 2) {
        this.filter.reverse();
      } else if(this.orderTitle != 0) {
        this.filter = Array.from(this.orderByKey('Nombre'));
      }
      if(this.orderArtist === 2) {
        this.filter.reverse();
      } else if(this.orderArtist != 0) {
        this.filter = Array.from(this.orderByKey('Artistas'));
      }
    }
  }

  clean() {
    this.orderArtist = 0;
    this.orderTitle = 0;
    this.orderCategory = false;
    this.searchList.reset();
    this.categories = [];
    for(let cat of this.audioService.categories) {
      this.categories.push({name: cat, checked: false });
    }
    delete this.filter;
  }

  isFilter() {
    if(this.filter) {
      return this.filter;
    }
    return this.isFavorite();
  }

  isFavorite() {
    if(this.list.ID === this.audioService.favoriteID) {
      return this.audioService.favoriteSongs;
    }
    return this.list.Canciones;
  }

  byArtist() {
    ++this.orderArtist;
    if(this.orderArtist === 2) {
      this.filter.reverse();
    } else {
      this.orderArtist = 1;
      this.filter = Array.from(this.orderByKey('Artistas'));
    }
  }

  byTitle() {
    ++this.orderTitle;
    if(this.orderTitle === 2) {
      this.filter.reverse();
    } else {
      this.orderTitle = 1;
      this.filter = Array.from(this.orderByKey('Nombre'));
    }
    console.log(this.filter);
  }

  private orderByKey(key) {
    var aux;
    if(this.filter && this.filter.length > 0) {
      aux = new Array(this.filter.length);
      aux = Array.from(this.filter);
    } else if(this.list.ID === this.audioService.favoriteID) {
      aux = new Array(this.audioService.favoriteSongs.length);
      aux = Array.from(this.audioService.favoriteSongs);
    } else {
      aux = new Array(this.list.Canciones.length);
      aux = Array.from(this.list.Canciones);
    }
    return aux.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  async byCategory(arr) {
    var aux;
    if(arr && arr.length > 0) {
      aux = new Array(arr.length);
      aux = Array.from(arr);
    } else if(this.list.ID === this.audioService.favoriteID) {
      aux = new Array(this.audioService.favoriteSongs.length);
      aux = Array.from(this.audioService.favoriteSongs);
    } else {
      aux = new Array(this.list.Canciones.length);
      aux = Array.from(this.list.Canciones);
    }
    const filt = this.categories.filter(opt => opt.checked).map(opt => opt.name);
    if(!filt || filt.length === 0) {
      if(this.orderCategory) {
        this.filter = aux;
        this.orderCategory = false;
        if(this.orderTitle === 2) {
          this.filter.reverse();
        } else if(this.orderTitle != 0) {
          this.filter = Array.from(this.orderByKey('Nombre'));
        }
        if(this.orderArtist === 2) {
          this.filter.reverse();
        } else if(this.orderArtist != 0) {
          this.filter = Array.from(this.orderByKey('Artistas'));
        }
      }
      return;
    }
    this.orderCategory = true;
    this.filter = [];
    for(let song of aux) {
      var added = false;
      for(let cat of filt) {
        for(let songCat of song.Categorias) {
          if(songCat === cat) {
            added = true;
            break;
          }
        }
        if(added) {
          this.filter.push(song);
          break;
        }
      }
    }
    if(this.orderTitle === 2) {
      this.filter.reverse();
    } else if(this.orderTitle != 0) {
      this.filter = Array.from(this.orderByKey('Nombre'));
    }
    if(this.orderArtist === 2) {
      this.filter.reverse();
    } else if(this.orderArtist != 0) {
      this.filter = Array.from(this.orderByKey('Artistas'));
    }
  }

  ngOnInit() { }

}
