import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../shared/websockets/websocket.service';
import {AvatarGeneratorService} from '../shared/avatar/avatar-generator.service';
import {Sex} from '../shared/avatar/sex.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Player} from '../shared/players/model/player';
import {Data} from '../shared/websockets/model/data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  sex: Sex;
  avatarUrl: string;
  userName: string;
  roomId: string;

  constructor(private socketService: WebsocketService,
              private _avatarService: AvatarGeneratorService,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetection: ChangeDetectorRef) {
    this.sex = Sex.MALE;
    this.userName = 'Hrac';
    this.avatarUrl = this.avatarService.generateAvatarUrlBySex(this.sex);
    this.roomId = this.route.snapshot.queryParamMap.get('code');
  }

  ngOnDestroy(): void {

  }

  get avatarService(): AvatarGeneratorService {
    return this._avatarService;
  }

  canConnect = (response: Data): void => {
    if (response.type === 'canConnect') {
      if (response.data === false) {
        this.roomId = null;
      }
    }
  };

  ngOnInit(): void {
    this.socketService.connect();
    if (this.roomId) {
      this.socketService.sendMessage(this.roomId, 'canConnect');
      this.socketService.subject.subscribe(this.canConnect);
    }
  }

  regenerateAvatar(): void {
    this.avatarUrl = this.avatarService.generateAvatarUrlBySex(this.sex);
  }

  ngAfterViewInit(): void {
  }

  createRoom(): void {
    if (this.roomId) {
      const player: Player = {
        id: this.userName + this.generateId(8),
        name: this.userName,
        avatarUrl: this.avatarUrl,
        operator: false,
        drawer: false,
        points: 0,
        correctRound: false
      };
      localStorage.setItem('player', JSON.stringify(player));
      this.socketService.sendMessage({
        id: this.roomId, player
      }, 'addPlayerToRoom');
    } else {
      const player: Player = {
        id: this.userName + this.generateId(8),
        name: this.userName,
        avatarUrl: this.avatarUrl,
        operator: true,
        drawer: true,
        points: 0,
        correctRound: false
      };
      localStorage.setItem('player', JSON.stringify(player));
      this.socketService.sendMessage(player, 'createRoom');
    }
    this.router.navigate(['lobby']).then();
  }

  setName(event): void {
    this.userName = event.target.value;
  }

  generateId(length: number): string {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
}
