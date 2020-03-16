import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './pages/player/player.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';

const routes: Routes = [
  { path: 'lists', component: PlaylistsComponent },
  { path: 'lists/:x', component: PlayerComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
