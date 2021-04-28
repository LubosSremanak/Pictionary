import {Component, OnDestroy, OnInit} from '@angular/core';
import {Player} from '../../shared/players/model/player';
import {WebsocketService} from '../../shared/websockets/websocket.service';
import {Data} from '../../shared/websockets/model/data';
import {Router} from '@angular/router';
import {MatSelectChange} from '@angular/material/select';
import {SettingsGame} from './model/settings-game';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  players: Player[];
  roomId: string;
  isOperator: boolean;
  settings: SettingsGame;

  constructor(private socketsService: WebsocketService,
              private router: Router) {
    this.players = [];
    if (!this.socketsService.subject) {
      this.socketsService.connect();
      const roomId = localStorage.getItem('roomId');
      this.socketsService.sendMessage(roomId, 'allPlayers');
    }
    this.isOperator = false;
    this.settings = {rounds: 3, limitInSeconds: 40};
    this.socketsService.subject.subscribe(this.handleResponse);
  }

  ngOnDestroy(): void {
  }


  handleResponse = (response: Data): void => {
    if (response.type === 'allPlayers') {
      this.players = response.data.players;
      this.isOperatorSet();
      localStorage.setItem('roomId', response.data.id);
      this.roomId = 'https://wt143.fei.stuba.sk/zadanie5/room?code=' + response.data.id;
    }
    if (response.type === 'startGame') {
      this.router.navigate(['game']).then();
    }
  };

  isOperatorSet(): void {
    const actualPlayer = JSON.parse(localStorage.getItem('player'));
    this.isOperator = !!actualPlayer.operator;
  }

  ngOnInit(): void {

  }

  startGame(): void {
    const roomId = localStorage.getItem('roomId');
    this.socketsService.sendMessage({settings: this.settings, roomId}, 'settings');
    this.socketsService.sendMessage(roomId, 'startGame');
    this.socketsService.sendMessage(roomId, 'disableRoomConnection');
  }

  setRounds(event: MatSelectChange): void {
    this.settings.rounds = event.value;
  }

  setRoundLimit(event: MatSelectChange): void {
    this.settings.limitInSeconds = event.value;
  }
}
