import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EqualizerComponent } from './pages/equalizer/equalizer.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { ListComponent } from './pages/list/list.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { SongComponent } from './pages/song/song.component';

const routes: Routes = [
  { path: 'lists', component: PlaylistsComponent },
  { path: 'lists/:id', component: ListComponent, data: {queue: false, search: false} },
  { path: 'podcasts', component: PodcastsComponent },
  { path: 'equalizer', component: EqualizerComponent },
  { path: 'song', component: SongComponent },
  { path: 'queue', component: ListComponent, data: {queue: true, search: false} },
  { path: 'search/:id', component: ListComponent, data: {queue: false, search: true} },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
