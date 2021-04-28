import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {LobbyComponent} from './login/lobby/lobby.component';
import {LobbyGuard} from './login/lobby/lobby.guard';
import {GameComponent} from './game/game.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent,
  },
  {
    path: 'game',
    component: GameComponent, canActivate: [LobbyGuard]
  },
  {path: 'lobby', component: LobbyComponent, canActivate: [LobbyGuard]},
  {path: '**', component: LoginComponent, canActivate: [LobbyGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
