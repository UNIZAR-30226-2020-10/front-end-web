import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { ListComponent } from './pages/list/list.component';
import { SongComponent } from './pages/song/song.component';
import { SearchPodcastComponent } from './pages/search-podcast/search-podcast.component';
import { AlbumComponent } from './pages/album/album.component';
import { InicialScreenComponent } from './pages/inicial-screen/inicial-screen.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { AccessGuardService } from './services/access-guard.service';
import { ArtistComponent } from './pages/artist/artist.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { InfoComponent } from './pages/info/info.component';

const routes: Routes = [
  { path: 'album/:id', component: AlbumComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'music/lists', component: PlaylistsComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'music/lists/:id', component: ListComponent, data: {queue: false, search: false, add: false, category: false, requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'podcasts', component: SearchPodcastComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'song', component: SongComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'category/:id', component: ListComponent, data: {queue: false, search: false, add: false, category: true, requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'queue', component: ListComponent, data: {queue: true, search: false, add: false, category: false, requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'search/:id', component: ListComponent, data: {queue: false, search: true, add: false, category: false, requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'song/add', component: ListComponent, data: {queue: false, search: false, add: true, category: false, requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'music', component: InicialScreenComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'register', component: RegisterComponent, canActivate: [ AccessGuardService ] },
  { path: 'login', component: LoginComponent, canActivate: [ AccessGuardService ] },
  { path: 'podcasts/:id', component: PodcastsComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'conf', component: ConfigurationComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'artist/:id', component: ArtistComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'profile/:id', component: PerfilComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: 'friends', component: FriendsComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
  { path: '', component: InfoComponent, data: {requiresLogin: false}, canActivate: [ AccessGuardService ] },
  { path: '**', component: InicialScreenComponent, data: {requiresLogin: true}, canActivate: [ AccessGuardService ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
