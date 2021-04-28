import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app.routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {PanelComponent} from './canvas/panel/panel.component';
import {MatRadioModule} from '@angular/material/radio';
import {LobbyComponent} from './login/lobby/lobby.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {KonvaModule} from 'ng2-konva';
import {GameComponent} from './game/game.component';
import {CanvasComponent} from './canvas/canvas.component';
import {EndGameModalComponent} from './game/end-game-modal/end-game-modal.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent,
    LobbyComponent,
    GameComponent,
    CanvasComponent,
    EndGameModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ClipboardModule,
    MatTooltipModule,
    CommonModule,
    KonvaModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}

