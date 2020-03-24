import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {

  podcastsForm;
  totalAngularPackages;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.podcastsForm = this.formBuilder.group({ title: ''});
   }

  ngOnInit(): void {
  }

  async onSubmit(title){
    this.podcastsForm.reset();

    console.warn('Titulo seleccionado: ', title);

    const headers = { 'X-ListenAPI-Key': 'fb46ce2b5ca54885969d1445995238e1' }
    this.http.get<any>('https://listen-api.listennotes.com/api/v2/search?q=star%20wars&type=podcast&only_in=title&language=English', { headers }).subscribe(data => {
      this.totalAngularPackages = data.total;
})
  }

}
