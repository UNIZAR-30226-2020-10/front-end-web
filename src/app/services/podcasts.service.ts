import { Injectable } from '@angular/core';
import { Podcast } from '../podcast'
import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from '../services/message.service'

@Injectable({
  providedIn: 'root'
})
export class PodcastsService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getPodcasts(title: String): Observable<Podcast[]> {
    const url = `https://listen-api.listennotes.com/api/v2/search?q=${title}&type=episode&language=Spanish`;
    return this.http.get<Podcast[]>(url).pipe(
      tap(_ => this.log(`fetched podcast title=${title}`)),
      catchError(this.handleError<Podcast[]>(`getPodcast title=${title}`))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
