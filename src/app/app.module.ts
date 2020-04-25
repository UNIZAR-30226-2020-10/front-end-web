import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlayerComponent } from './pages/player/player.component';
import { ListComponent } from './pages/list/list.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AudioService } from './services/audio.service';
import { CloudService } from './services/cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessagesComponent } from './pages/messages/messages.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { PodcastDetailComponent } from './pages/podcast-detail/podcast-detail.component';
import { EqualizerComponent } from './pages/equalizer/equalizer.component';
import { SongComponent } from './pages/song/song.component';
import { SearchPodcastComponent } from './pages/search-podcast/search-podcast.component';
import { AlbumComponent } from './pages/album/album.component';
import { InicialScreenComponent } from './pages/inicial-screen/inicial-screen.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoaderComponent } from './pages/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { AlertsService } from './services/alerts.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    SidenavComponent,
    ToolbarComponent,
    ListComponent,
    PlaylistsComponent,
    ListComponent,
    MessagesComponent,
    PodcastsComponent,
    PodcastDetailComponent,
    EqualizerComponent,
    SongComponent,
    SearchPodcastComponent,
    AlbumComponent,
    InicialScreenComponent,
    LoginComponent,
    RegisterComponent,
    LoaderComponent,
    AlertsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [AudioService, CloudService, LoaderService, AlertsService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
