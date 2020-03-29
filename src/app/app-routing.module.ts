import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EqualizerComponent } from './pages/equalizer/equalizer.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { ListComponent } from './pages/list/list.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { PodcastDetailComponent } from './pages/podcast-detail/podcast-detail.component';

const routes: Routes = [
  { path: 'lists', component: PlaylistsComponent },
  { path: 'lists/:id', component: ListComponent },
  { path: 'podcasts', component: PodcastsComponent },
  { path: 'equalizer', component: EqualizerComponent },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
