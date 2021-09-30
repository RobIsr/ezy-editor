import { Injectable } from '@angular/core';
import { identity } from 'lodash';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Doc } from '../models/doc';

@Injectable()
export class SocketService {
  constructor(private socket: Socket) {}

  sendMessage(id: string, name: string, html: string) {
    var document = {id: id, name: name, html: html}
    this.socket.emit('message', document);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data:any) => data.msg));
  }

  createRoom(docId: string) {
    this.socket.emit('create', docId);
  }
}
