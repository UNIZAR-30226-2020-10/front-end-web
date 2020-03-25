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
  private url_1 = 'https://listen-api.listennotes.com/api/v2/search?q='

  httpOptions = {
    headers: new HttpHeaders({ 'X-ListenAPI-Key': 'fb46ce2b5ca54885969d1445995238e1' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  // Coje la lista de podcasts de MOCK-PODCASTS
  getPodcasts(title: string): Observable<Podcast[]> {
    // Para mandar los mensajes
    this.messageService.add('PodcastService: fetched podcasts');
    return this.http.post<Podcast[]>(`${this.url_1}${title}`, this.httpOptions)
  }

  /*getPodcast(id: number): Observable<Podcast> {
    //Mensaje que no sirve para nada
    this.messageService.add(`PodcastService: fetche podcast id=${id}`);
    return of(PODCASTS.find(podcast => podcast.id === id));
  }*/
}
