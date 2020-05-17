import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { CookieService } from 'ngx-cookie-service';
import { AccessGuardService } from './services/access-guard.service';
import { ArtistComponent } from './pages/artist/artist.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FriendsService } from './services/friends.service';
import { FriendsComponent } from './pages/friends/friends.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { BuscarAmigosComponent } from './pages/buscar-amigos/buscar-amigos.component';
import { InfoComponent } from './pages/info/info.component'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export function appInit(cloudService: CloudService): () => Promise<any> {
  return () => cloudService.initApp();
}

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
    SongComponent,
    SearchPodcastComponent,
    AlbumComponent,
    InicialScreenComponent,
    LoginComponent,
    RegisterComponent,
    LoaderComponent,
    AlertsComponent,
    ConfigurationComponent,
    ArtistComponent,
    PerfilComponent,
    FriendsComponent,
    SolicitudesComponent,
    BuscarAmigosComponent,
    InfoComponent,
    NotificationsComponent,
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
    CookieService, AccessGuardService, FriendsService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInit, deps: [CloudService], multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
