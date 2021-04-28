import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Data} from './model/data';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private error = ((error) => {
    console.log('Error happened', error);
  });
  private complete = (() => {
    console.log('Socket send/read done');
  });
  private message = ((message) => {
    if (message.type === 'connected') {
      console.log('Server talk', message);
    }
  });

  constructor() {
  }

  private _subject: WebSocketSubject<any>;

  get subject(): WebSocketSubject<any> {
    return this._subject;
  }

  public connect(): void {
    this._subject = webSocket('wss://wt143.fei.stuba.sk:9000');
    this._subject.subscribe(this.message, this.error, this.complete);
  }

  public sendMessage(message: any, type: string): void {
    const data: Data = {data: message, type};
    this._subject.next(data);
  }

  public close(): void {
    this._subject.complete();
  }

  public subjectSave(): void {
    const data: Data = {data: this._subject, type: 'saveSubject'};
    this._subject.next(data);
  }

  public subjectRetrieve(): void {
    const data: Data = {data: true, type: 'retrieveSubject'};
    this._subject.next(data);
  }

  public retrieveSubject(subject: WebSocketSubject<any>): void {
    this._subject = subject;
  }

}

