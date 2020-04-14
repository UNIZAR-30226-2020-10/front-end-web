import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List, Playlists, Song } from '../list';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

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
