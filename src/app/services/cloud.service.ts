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

  public user;
  public change;

  private url = "https://psoftware.herokuapp.com/";
  private askPlaylists: string = "list_lists";
  private askList: string = "list_data";
  private addToList: string = "add_to_list";
  private deleteFromList: string = "delete_from_list";
  private search: string = "search";
  private newList: string = "create_list";
  private eraseList: string = "delete_list";
  private songs: string = "list";
  private registerUser: string = "register";
  private sign: string = "sign_in";
  private eraseUser: string = "delete_user";
  private moveSong: string = "reorder";
  private listAlbum: string = "list_albums_data";
  private favoritePodcast: string = "podcast_fav";
  private notFavoritePodcast: string = "delete_podcast_fav";
  private isFavoritePodcast: string = "podcast_is_fav";

  async getPlaylists() {
    console.log(this.url+this.askPlaylists);
    var params = {'usuario': this.user};
    return await this.http.get<Playlists>(this.url+this.askPlaylists, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async getList(id) {
    console.log(this.url+this.askList);
    let params = new HttpParams();
    params = params.append('lista', id);
    return await this.http.get<List>(this.url+this.askList, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  addSong(song, list) {
    console.log(this.url+this.addToList);
    var params = {'lista': list, 'cancion': song};
    this.http.post(this.url+this.addToList, params)
      .subscribe(
        (response) => { console.log(response) },
        (error) => {console.log(error) }
      );
  }

  async deleteSong(song, list) {
    console.log(this.url+this.deleteFromList);
    var params = {'lista': list, 'cancion': song};
    var msg = "";
    await this.http.post(this.url+this.deleteFromList, params).toPromise().catch(
      error => { console.log(error.error.text); msg = error.error.text; }
    );
    return msg;
  }

  async createList(title) {
    console.log(this.url+this.newList);
    var params = {'lista': title, 'desc': "Lista añadida", 'usuario': this.user};
    var msg = "";
    await this.http.post(this.url+this.newList, params).toPromise().catch(
      error => { console.log(error.error.text); msg = error.error.text; }
    );
    return msg;
  }

  async deleteList(id) {
    console.log(this.url+this.eraseList);
    var params = {'lista': id};
    var msg = "";
    await this.http.post(this.url+this.eraseList, params).toPromise().catch(
      error => { console.log(error.error.text); msg = error.error.text; }
    );
    return msg;
  }

  searchSong(title): Observable<Array<Song>> {
    console.log(this.url+this.search);
    let params = new HttpParams();
    params = params.append('Nombre', title);
    return this.http.get<Array<Song>>(this.url+this.search, {params: params});
  }

  async move(id, bf, af) {
    console.log(this.url+this.moveSong);
    var params = {'lista': id, 'before': bf, 'after': af};
    await this.http.post(this.url+this.moveSong, params).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async signIn(email, pass) {
    console.log(this.url+this.sign);
    var params = {'email': email, 'password': pass};
    var msg = "";
    await this.http.post(this.url+this.sign, params).toPromise().catch(
      error => { msg = error.error.text; }
    );
    if(msg === "Success") {
      this.user = email;
      this.change = 'change-right';
    }
    return msg;
  }

  async register(email, pass, name, country, date) {
    console.log(this.url+this.registerUser);
    var params = {'email': email, 'password': pass, 'pais': country, 'fecha': date, 'nombre': name};
    var msg = "";
    await this.http.post(this.url+this.registerUser, params).toPromise().catch(
      error => { msg = error.error.text; }
    );
    if(msg === "Success") {
      this.user = email;
      this.change = 'change-right';
    }
    return msg;
  }

}
