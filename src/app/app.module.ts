import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlayerComponent } from './pages/player/player.component';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MusicControlComponent } from './pages/music-control/music-control.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    SidenavComponent,
    ToolbarComponent,
    MusicControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
