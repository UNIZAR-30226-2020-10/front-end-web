import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List, Playlists, Song } from '../list';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  files: List =
    {"Canciones":[{"Album":"Mi album 1","Artistas":["Ed Sheeran"],"ID":3,"Imagen":null,"Nombre":"Perfect","URL":"https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3"},
    {"Album":"Mi album 1","Artistas":["Ed Sheeran"],"ID":4,"Imagen":null,"Nombre":"Shape of You","URL":"http://moozika.ir/mycont/uploads/2017/10/Shape-Of-You-www.Moozika.ir_.mp3"},
    {"Album":"Mi album 2","Artistas":["Linkin Park (Cover)"],"ID":5,"Imagen":null,"Nombre":"In The End","URL":"http://moozika.ir/mycont/uploads/2018/10/In-The-End-Mellen-Gi-Tommee-Profitt-Remix.mp3"},
    {"Album":"Mi album 3","Artistas":["KYGO", "Selena Gomez"],"ID":6,"Imagen":null,"Nombre":"It Ain't me","URL":"http://moozika.ir/mycont/uploads/2019/03/01-It-Aint-Me.mp3"},
    {"Album":"Mi album 4","Artistas":["Maroon 5"],"ID":7,"Imagen":null,"Nombre":"Memories","URL":"http://dl.moozika.ir/mycont/uploads/2020/01/1-01-Memories.mp3"},
    {"Album":"Mi album 5","Artistas":["Jay Aliyev"],"ID":8,"Imagen":null,"Nombre":"Together","URL":"http://dl.moozika.ir/mycont/uploads/2020/01/Together.mp3"},
    {"Album":"Mi album 6","Artistas":["Vancouver Sleep Clinic"],"ID":9,"Imagen":null,"Nombre":"Revival","URL":"http://dl.moozika.ir/mycont/uploads/2019/11/11-Revival.mp3"},
    {"Album":"Mi album 6","Artistas":["Vancouver Sleep Clinic"],"ID":10,"Imagen":null,"Nombre":"Empire","URL":"http://dl.moozika.ir/mycont/uploads/2019/11/04-Empire.mp3"},
    {"Album":"Mi album 8","Artistas":["Lil Nas X"],"ID":11,"Imagen":null,"Nombre":"Old Town Road","URL":"http://dl.moozika.ir/mycont/uploads/2019/12/Old-Town-Road-Ft-Billy-Ray-Cyrus-Remix-1.mp3"},
    {"Album":"Mi album 9","Artistas":["Marshmello", "Khalid"],"ID":12,"Imagen":null,"Nombre":"Silence","URL":"http://moozika.ir/mycont/uploads/2017/11/Silence.mp3"}],
    "Desc":"Ejemplo de lista", "ID":0, "Imagen":null, "Nombre":"Ejemplo"};

  constructor(
    private http: HttpClient
  ) { }

  private url = "https://psoftware.herokuapp.com/";
  private askPlaylists: string = "list_lists";
  private askList: string = "list_data";
  private addToList: string = "add_to_list";
  private deleteFromList: string = "delete_from_list";
  private search: string = "search";
  private newList: string = "create_list";
  private eraseList: string = "delete_list";

  getFiles() {
    return this.files;
  }

  getPlaylists(): Observable<Playlists> {
    console.log(this.url+this.askPlaylists);
    return this.http.get<Playlists>(this.url+this.askPlaylists);
  }

  getList(id): Observable<List> {
    console.log(this.url+this.askList);
    let params = new HttpParams();
    params = params.append('list', id);
    return this.http.get<List>(this.url+this.askList, {params: params});
  }

  addSong(song, list) {
    console.log(this.url+this.addToList);
    var params = {'list': list, 'cancion': song};
    this.http.post(this.url+this.addToList, params)
      .subscribe(
        (response) => { console.log(response) },
        (error) => {console.log(error) }
      );
  }

  deleteSong(song, list) {
    console.log(this.url+this.deleteFromList);
    var params = {'list': list, 'cancion': song};
    this.http.post(this.url+this.deleteFromList, params)
      .subscribe(
        (response) => { console.log(response) },
        (error) => {console.log(error) }
      );
  }

  createList(title) {
    console.log(this.url+this.newList);
    var params = {'list': title, 'desc': "Lista añadida"};
    this.http.post(this.url+this.newList, params)
      .subscribe(
        (response) => { console.log(response) },
        (error) => {console.log(error) }
      );
  }

  deleteList(id) {
    console.log(this.url+this.eraseList);
    var params = {'list': id};
    this.http.post(this.url+this.eraseList, params)
      .subscribe(
        (response) => { console.log(response) },
        (error) => {console.log(error) }
      );
  }

  searchSong(title): Observable<Array<Song>> {
    console.log(this.url+this.search);
    let params = new HttpParams();
    params = params.append('Nombre', title);
    return this.http.get<Array<Song>>(this.url+this.search, {params: params});
  }
}
