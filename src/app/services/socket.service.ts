import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DocumentService } from './document.service';


@Injectable()
export class SocketService {
  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private socket: Socket) {}

  jwtToken = this.authService.userToken.accessToken;

  sendMessage(owner: string, id: string, name: string, html: string) {
    var document = {owner: owner, id: id, name: name, html: html, jwtToken: this.jwtToken}
    this.socket.emit('message', document);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data:any) => data.msg));
  }

  addAllowedUser(owner:string, docId:string, username:string) {
    this.socket.emit('add_allowed_user', { owner, docId, username });
  }

  removeAllowedUser(owner:string, docId:string, username:string) {
    this.socket.emit('remove_allowed_user', { owner, docId, username });
  }

  createRoom(docId: string) {
    this.socket.emit('create', docId);
  }
}
