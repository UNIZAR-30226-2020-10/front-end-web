import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './pages/player/player.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { ListComponent } from './pages/list/list.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { PodcastDetailComponent } from './pages/podcast-detail/podcast-detail.component';

const routes: Routes = [
  { path: 'lists', component: PlaylistsComponent },
  { path: 'lists/:x', component: ListComponent },
  { path: 'podcasts', component: PodcastsComponent },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
