import { Injectable } from '@angular/core';
import { Podcast } from 'src/app/podcast';
import { Observable, of } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  // Variables
  private podcast_url_1 = 'https://listen-api.listennotes.com/api/v2/search?q='
  private podcast_url_2 = '&type=podcast&only_in=title&language=Spanish'

  private episode_url_1 = 'https://listen-api.listennotes.com/api/v2/podcasts/';
  private podcastPost_url_2 = 'https://listen-api.listennotes.com/api/v2/podcasts';

  p;

  httpOptions = {
    headers: new HttpHeaders({ 'X-ListenAPI-Key': 'fa5d6d0b3b254e818d7308351facdef0' })
  };

  httpOptions2 = {
    headers: new HttpHeaders({ 'X-ListenAPI-Key': 'fa5d6d0b3b254e818d7308351facdef0', 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  // Coje la lista de podcasts de MOCK-PODCASTS
  async getPodcasts(title: String) {
    // Para mandar los mensajes
    return await this.http.get<Podcast>(`${this.podcast_url_1}${title}${this.podcast_url_2}`, this.httpOptions).toPromise();
  }

  getEpisodes(title: String): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.episode_url_1}${title}`, this.httpOptions);
  }

  // Bucle con @getPodcasts2
  getPodcastsPost(title): Observable<any>  {
    var splitted = title.split(",");
    var pods:any = []
    for (let pod of splitted) {
      console.log(pod);
      console.log("COMO LO MUEVE ESA MUCHACHOTA");
      this.getEpisodes(pod).subscribe(data => this.p = data);
      console.log(this.p);
      pods.push(this.p);
    }
    console.log("SE PRENDIO LA WEA");
    return pods;
    //const ids = 'ids='+title
    //return this.http.post<any>(`${this.podcastPost_url_2}`, ids, this.httpOptions2);
  }
}
