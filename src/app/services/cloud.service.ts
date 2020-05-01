import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List, Playlists, Song } from '../list';
import { CookieService } from "ngx-cookie-service";
import { Router } from '@angular/router';
import { AlertsService } from './alerts.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router,
    private alertService: AlertsService,
    private audioService: AudioService
  ) {
    const token = this.getToken();
    console.log(token);
    if(token.email) {
      this.user = token.email;
      this.change = 'change-right';
    }
  }

  public user;
  public change;

  setToken(token) {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 15);
    this.cookies.set("TuneIT", JSON.stringify(token), dateNow);
  }

  getToken() {
    if(this.cookies.check("TuneIT")) {
      return JSON.parse(this.cookies.get("TuneIT"));
    }
    return "false";
  }

  closeSession() {
    this.user = undefined;
    this.change = 'nothing';
    if(this.cookies.check("TuneIT")) {
      this.cookies.delete("TuneIT");
    }
    this.audioService.maxIndex = 0;
    this.audioService.audioList = [];
    this.audioService.pause();
    this.audioService.currentFile = {};
    this.alertService.showAlert(1, "", "Se ha cerrado la sesión");
    this.router.navigateByUrl('/login');
  }

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
  private info: string = "info_usuario";
  private sign: string = "sign_in";
  private eraseUser: string = "delete_user";
  private modifyUser: string = "modify";
  private moveSong: string = "reorder";
  private listAlbum: string = "list_albums_data";
  private listArtist: string = "list_artist_data";
  private favoritePodcast: string = "podcast_fav";
  private notFavoritePodcast: string = "delete_podcast_fav";
  private isFavoritePodcast: string = "podcast_is_fav";
  private podcastList: string = "list_podcast";

  async getPlaylists() {
    console.log(this.url+this.askPlaylists);
    var params = {'usuario': this.user};
    return await this.http.get<Playlists>(this.url+this.askPlaylists, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async getList(id) {
    console.log(this.url+this.askList);
    var params = {'lista': id};
    return await this.http.get<List>(this.url+this.askList, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async addSong(song, list) {
    console.log(this.url+this.addToList);
    var msg;
    var params = {'lista': list, 'cancion': song};
    await this.http.post(this.url+this.addToList, params).toPromise().catch(
      error => { console.log(error.error.text); msg = error.error.text; }
    );
    return msg;
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

  async searchSong(title) {
    console.log(this.url+this.search);
    var params = {'nombre': title};
    return await this.http.get<Array<Song>>(this.url+this.search, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async move(id, bf, af) {
    console.log(this.url+this.moveSong);
    var params = {'lista': id, 'before': bf, 'after': af};
    await this.http.post(this.url+this.moveSong, params).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async signIn(email, pass, session) {
    console.log(this.url+this.sign);
    var params = {'email': email, 'password': pass};
    var msg = "";
    await this.http.post(this.url+this.sign, params).toPromise().catch(
      error => { msg = error.error.text; }
    );
    if(msg === "Success" && this.user === undefined) {
      if(session) {
        this.setToken(params);
      }
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
    return msg;
  }

  async deleteUser(pass) {
    console.log(this.url+this.eraseUser);
    var params = {'email': this.user, 'password': pass};
    var msg = "";
    await this.http.post(this.url+this.eraseUser, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    if(msg === "Success") {
      this.closeSession();
    }
    return msg;
  }

  async modify(pass, name, country) {
    console.log(this.url+this.modifyUser);
    var params = {'email': this.user};
    if(pass.length != 0) {
      params['password'] = pass;
    }
    if(name.length != 0) {
      params['nombre'] = name;
    }
    if(country.length != 0) {
      params['pais'] = country;
    }
    var msg = "";
    await this.http.post(this.url+this.modifyUser, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    return msg;
  }

  async infoUser() {
    console.log(this.url+this.info);
    var params = {};
    var msg = "";
    await this.http.post(this.url+this.info, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    return msg;
  }

  async infoArtist(id) {
    console.log(this.url+this.listArtist);
    var params = {'artista': id};
    return await this.http.get(this.url+this.listArtist, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async infoAlbum(id) {
    console.log(this.url+this.listAlbum);
    var params = {'album': id};
    return await this.http.get(this.url+this.listAlbum, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

  async isPodcastFavorite(id) {
    console.log(this.url+this.isFavoritePodcast);
    var params = {'email': this.user, 'podcast': id};
    var msg = "";
    await this.http.post(this.url+this.isFavoritePodcast, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    return msg;
  }

  async deletePodcast(id) {
    console.log(this.url+this.notFavoritePodcast);
    var params = {'email': this.user, 'podcast': id};
    var msg = "";
    await this.http.post(this.url+this.notFavoritePodcast, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    return msg;
  }

  async addPodcast(id, name) {
    console.log(this.url+this.favoritePodcast);
    var params = {'email': this.user, 'podcast': id, 'nombre': name};
    var msg = "";
    await this.http.post(this.url+this.favoritePodcast, params).toPromise().catch(
      error => { msg = error.error.text }
    );
    return msg;
  }

  async listPodcast() {
    console.log(this.url+this.podcastList);
    var params = {'email': this.user};
    return await this.http.get(this.url+this.podcastList, {params: params}).toPromise().catch(
      error => { console.log(error.error.text) }
    );
  }

}
