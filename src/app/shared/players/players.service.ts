import {Injectable} from '@angular/core';
import {WebsocketService} from '../websockets/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private sockets: WebsocketService) {
  }

  public async getPlayers(): Promise<any> {

  }
}
