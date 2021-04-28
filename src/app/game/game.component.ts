import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../shared/websockets/websocket.service';
import {Data} from '../shared/websockets/model/data';
import {Player} from '../shared/players/model/player';
import {MatDialog} from '@angular/material/dialog';
import {EndGameModalComponent} from './end-game-modal/end-game-modal.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],

})
export class GameComponent implements OnInit, AfterViewChecked {
  @ViewChild('textArea') private textArea: ElementRef;
  @ViewChild('timer') private timer: ElementRef;
  @ViewChild('round') private round: ElementRef;
  @ViewChild('rounds') private rounds: ElementRef;
  @ViewChild('word') private word: ElementRef;
  allPlayers: Player[];
  isDrawer: boolean;
  correctWords: boolean;

  constructor(private socketService: WebsocketService,
              private dialog: MatDialog) {
    const roomId = localStorage.getItem('roomId');
    if (!this.socketService.subject) {
      this.socketService.connect();
    }
    this.correctWords = false;
    this.socketService.sendMessage(roomId, 'allPlayers');
    this.socketService.subject.subscribe(this.handleResponse);

  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  secondsToTime(seconds): string {
    const s = seconds % 60;
    seconds = (seconds - s) / 60;
    const m = seconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  handleResponse = (response: Data): void => {
    if (response.type === 'allPlayers') {
      this.allPlayers = (response.data.players).sort((a, b) => b.points - a.points);
      this.correctWords = false;
    }
    if (response.type === 'receivedMessage') {
      this.textArea.nativeElement.value += response.data;
    }
    if (response.type === 'correctWords') {
      this.correctWords = true;
    }
    if (response.type === 'gameData') {
      this.timer.nativeElement.innerText = this.secondsToTime(response.data.time);
      this.round.nativeElement.innerText = response.data.round;
      this.rounds.nativeElement.innerText = response.data.rounds;
    }
    if (response.type === 'actualWord') {
      {
        if (this.word) {
          this.word.nativeElement.innerText = response.data;
        }
      }
    }
    if (response.type === 'drawerId') {
      this.handleIsDrawer(response.data);
    }
    if (response.type === 'endGame') {
      this.dialog.open(EndGameModalComponent, {
        data: this.getWinner(),
        panelClass: 'modal'
      });
    }
  };

  getWinner(): Player {
    let winner = this.allPlayers[0];
    this.allPlayers.forEach((player) => {
      if (winner.points < player.points) {
        winner = player;
      }
    });
    return winner;
  }

  handleIsDrawer(playerId): void {
    const actualPlayer = JSON.parse(localStorage.getItem('player'));
    this.isDrawer = actualPlayer.id === playerId;
    if (this.word && !this.isDrawer) {
      this.word.nativeElement.innerText = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.textArea.nativeElement.scrollTop = this.textArea.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(textArea: HTMLTextAreaElement, messageEvent: any): void {
    const player = JSON.parse(localStorage.getItem('player'));
    const roomId = localStorage.getItem('roomId');
    let message = messageEvent.value;
    message = player.name + ' ' + new Date().toLocaleTimeString() + ': ' + message + ' ' + '\n';
    this.socketService.sendMessage({
      id: roomId, content: message, words: messageEvent.value,
      playerId: player.id
    }, 'sendMessage');
    messageEvent.value = '';
  }


  formatName(name: string): string {
    if (name.length > 6) {
      return name.substring(0, 6) + '..';
    }
    return name;
  }

}
