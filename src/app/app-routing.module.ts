import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EqualizerComponent } from './pages/equalizer/equalizer.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { ListComponent } from './pages/list/list.component';
import { SongComponent } from './pages/song/song.component';
import { SearchPodcastComponent } from './pages/search-podcast/search-podcast.component';
import { AlbumComponent } from './pages/album/album.component';
import { InicialScreenComponent } from './pages/inicial-screen/inicial-screen.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'album/:id', component: AlbumComponent },
  { path: 'lists', component: PlaylistsComponent },
  { path: 'lists/:id', component: ListComponent, data: {queue: false, search: false, add: false} },
  { path: 'podcasts', component: SearchPodcastComponent },
  { path: 'equalizer', component: EqualizerComponent },
  { path: 'song', component: SongComponent },
  { path: 'queue', component: ListComponent, data: {queue: true, search: false, add: false} },
  { path: 'search/:id', component: ListComponent, data: {queue: false, search: true, add: false} },
  { path: 'song/add', component: ListComponent, data: {queue: false, search: false, add: true} },
  { path: 'initial-screen', component: InicialScreenComponent},
  { path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
