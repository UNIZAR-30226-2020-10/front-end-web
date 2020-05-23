import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CloudService } from '../../services/cloud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertsService } from 'src/app/services/alerts.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {
  tableColumns: string[] = ['Imagen', 'Nombre', 'Artista', 'Categoría', 'Botones'];
  searchAlbum: string[] = ['Imagen', 'Nombre', 'Artista', 'Fecha'];
  searchArtist: string[] = ['Imagen', 'Nombre', 'Pais'];
  tableAdd: string[] = ['Imagen', 'Nombre'];
  list;
  playlists;
  filter: Boolean = false;
  queue: Boolean;
  search: Boolean;
  song;
  add: Boolean;
  category: Boolean;
  searchList;
  categories;
  hover = "";
  dataArtist;
  dataAlbum;
  showCat: String = "fade";
  timer;
  drag: Boolean = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    public alertService: AlertsService,
    public router: Router,
    private loader: LoaderService,
    private friendService: FriendsService
  ) {
    this.categories = [];
    for(let cat of this.audioService.categories) {
      this.categories.push({name: cat.Nombre, checked: false });
    }
    this.categories.push({name: 'Podcast', checked: false });
    this.searchList = this.formBuilder.group({
      titulo: ''
    });
    this.queue = this.route.snapshot.data['queue'];
    this.search = this.route.snapshot.data['search'];
    this.add = this.route.snapshot.data['add'];
    this.category = this.route.snapshot.data['category'];
    this.route.paramMap.subscribe(async params => {
      if(this.queue) {
        this.list = {"Canciones":this.audioService.audioList,"Nombre":"Cola de reproducción",
                      "ID":'c', "Desc":"Cola de reproducción", "Imagen":"default"};
        if(this.list.Canciones === [] || this.list === undefined) {
          this.alertService.showAlert(3, "", "Cola vacía");
        }
      } else if(this.search) {
        this.list = await this.cloudService.searchSong(params.get('id'));
        this.list.Nombre = "Resultados de la búsqueda"
        if(this.list.Canciones.length === 0 && this.list.Albums.length === 0 && this.list.Artistas.length === 0) {
          this.alertService.showAlert(3, "", "No se ha encontrado ninguna coincidencia");
        }
        this.dataArtist = new MatTableDataSource(this.list.Artistas);
        this.dataAlbum = new MatTableDataSource(this.list.Albums);
      } else if(this.add) {
        this.list = undefined;
        this.newAdd();
        this.song = this.audioService.passSong;
      } else if(this.category) {
        var data = this.audioService.categories.find(function(item){
          if(item.Nombre === params.get('id')){
            return item;
          }
        });
        this.list = {"Canciones": await this.cloudService.categories([data.Nombre]),
                     "Nombre": data.Nombre, "ID":'', "Desc": data.Nombre, "Imagen": data.Imagen};
      } else {
        const id = parseInt(this.cloudService.decrypt(params.get('id')));
        this.list = await this.cloudService.getList(id);
        if(id === this.audioService.favoriteID) {
          this.audioService.showFavorite = true;
          this.list.Canciones = this.audioService.favoriteSongs;
        }
        if(this.list.Canciones.length === 0) {
          this.alertService.showAlert(3, "", "Lista vacía");
        }
      }
      this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
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

  async removeFromList(song, index, list) {
    var pr = "";
    if(list != 'c') {
      await this.cloudService.deleteSong(song.ID, list);
      if(list === this.audioService.favoriteID) {
        this.audioService.dropFav(index);
        if(song.ID === this.audioService.currentFile.song.ID) {
          this.audioService.songFav = false;
        }
      } else {
        this.list.Canciones.splice(index, 1);
      }
      pr = "lista " + this.list.Nombre;
    } else {
      this.audioService.deleteFromQueue(index);
      pr = "cola";
      if(this.audioService.maxIndex === 0) {
        this.router.navigateByUrl('/music');
      }
    }
    this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
    this.alertService.showAlert(1, "", song.Nombre + " ha sido eliminada de la " + pr);
  }

  random() {
    this.audioService.random();
    this.list.Canciones = this.audioService.audioList;
    this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
  }

  share(elem) {
    if(this.friendService.friends && this.friendService.friends.length === 0) {
      this.alertService.showAlert(0, "", "No tienes ningún amigo");
      return;
    }
    this.audioService.passSong = elem;
    this.router.navigateByUrl('/share');
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
      this.audioService.loadList([song], 0, null);
    } else {
      this.audioService.loadList(this.audioService.dataSource.filteredData, index, this.list.ID);
    }
  }

  async drop(event: CdkDragDrop<string[]>) {
    this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
    this.drag = false;
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
    console.log("BUSQUEDA");
    var chosen = [];
    for(let song of this.list.Canciones) {
      if(song.Nombre.toLowerCase().includes(title.titulo.toLowerCase())) {
        chosen.push(song);
      } else {
        for(let artist of song.Artistas) {
          if(artist.toLowerCase().includes(title.titulo.toLowerCase())) {
            chosen.push(song);
            break;
          }
        }
      }
    }
    this.audioService.dataSource = new MatTableDataSource(chosen);
  }

  clear() {
    clearTimeout(this.timer);
  }

  fadeCat() {
    this.showCat += " fadeCat";
  }

  show() {
    if(this.queue) {
      this.showCat = "show showQueue"
    } else if(!this.search) {
      this.showCat = "show showList";
    } else {
      this.showCat = "show";
    }
    this.timer = setTimeout(() => { this.fadeCat() }, 3000);
  }

  async byCategory() {
    var aux = [];
    const filt = this.categories.filter(opt => opt.checked).map(opt => opt.name);
    if(!filt || filt.length === 0) {
      this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
      return;
    }
    for(let song of this.list.Canciones) {
      var added = false;
      for(let cat of filt) {
        for(let songCat of song.Categorias) {
          if(songCat === cat) {
            added = true;
            break;
          }
        }
        if(added) {
          aux.push(song);
          break;
        }
      }
    }
    if(aux.length === 0) {
      this.alertService.showAlert(3, "", "No se han encontrado canciones del género introducido");
      this.showCat += " fadeCat";
      this.categories = [];
      for(let cat of this.audioService.categories) {
        this.categories.push({name: cat.Nombre, checked: false });
      }
      this.categories.push({name: 'Podcast', checked: false });
      this.audioService.dataSource = new MatTableDataSource(this.list.Canciones);
    } else {
      this.audioService.dataSource = new MatTableDataSource(aux);
    }
  }

  sortAlbum(sort: Sort) {
    const data = this.list.Albums.slice();
    if (!sort.active || sort.direction === '') {
      this.dataAlbum = new MatTableDataSource(data);
      return;
    }
    this.dataAlbum = new MatTableDataSource(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Nombre': return this.compare(a.Nombre, b.Nombre, isAsc);
        case 'Artistas': return this.compare(a.Artistas, b.Artistas, isAsc);
        case 'Fecha': return this.compare(a.Pais, b.Pais, isAsc);
        default: return 0;
      }
    }));
  }

  sortArtist(sort: Sort) {
    const data = this.list.Artistas.slice();
    if (!sort.active || sort.direction === '') {
      this.dataArtist = new MatTableDataSource(data);
      return;
    }
    this.dataArtist = new MatTableDataSource(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Nombre': return this.compare(a.Nombre, b.Nombre, isAsc);
        case 'Artistas': return this.compare(a.Artistas, b.Artistas, isAsc);
        case 'Pais': return this.compare(a.Pais, b.Pais, isAsc);
        default: return 0;
      }
    }));
  }

  sortData(sort: Sort) {
    const data = this.list.Canciones.slice();
    if (!sort.active || sort.direction === '') {
      this.audioService.dataSource = new MatTableDataSource(data);
      return;
    }
    this.audioService.dataSource = new MatTableDataSource(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Nombre': return this.compare(a.Nombre, b.Nombre, isAsc);
        case 'Artistas': return this.compare(a.Artistas, b.Artistas, isAsc);
        default: return 0;
      }
    }));
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  async deleteList() {
    const msg = await this.cloudService.deleteList(this.list.ID);
    if(msg === "Error") {
      this.alertService.showAlert(0, "ERROR", "Vuelve a intentarlo más tarde");
    } else {
      this.audioService.lists = await this.cloudService.getPlaylists(this.cloudService.user);
      this.alertService.showAlert(1, "", "La lista " + this.list.Nombre + " se ha eliminado");
      this.router.navigateByUrl('/music');
    }
  }

  async addList() {
    await this.cloudService.addList(this.list.ID);
    this.audioService.lists = await this.cloudService.getPlaylists(this.cloudService.user);
    this.list.ID = this.audioService.lists[this.audioService.lists.length - 1].ID;
    this.alertService.showAlert(1, "", "Se ha añadido la lista " + this.list.Nombre + " a tus playlists");
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.audioService.showFavorite = false;
  }

}
