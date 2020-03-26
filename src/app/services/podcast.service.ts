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
  private url_2 = '&only_in=title&language=Spanish'

  httpOptions = {
    headers: new HttpHeaders({ 'X-ListenAPI-Key': 'fb46ce2b5ca54885969d1445995238e1' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  // Coje la lista de podcasts de MOCK-PODCASTS
  getPodcasts(title: String): Observable<Podcast> {
    // Para mandar los mensajes
    return this.http.get<Podcast>(`${this.url_1}${title}${this.url_2}`, this.httpOptions);
  }
}
