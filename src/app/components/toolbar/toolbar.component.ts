import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DocumentService } from '../../services/document.service';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  UNSAVED_MESSAGE = "(Unsaved document...)";
  @Output() saveEvent = new EventEmitter();
  @Output() newEvent = new EventEmitter();
  faSave = faSave;
  faPlus = faPlus;
  faDelete = faTrashAlt;
  faSignout = faSignOutAlt;
  fileName:string = this.UNSAVED_MESSAGE; //To be displayed in toolbar when document is open.
  typing = false;
  searchInput:string = "";
  searching:boolean = false;
  allowedUsers:string[] = [];
  allUsers = [];
  currentId = "";

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private socket: Socket,
    ) {}
  ngOnInit(): void {
    this.documentService.notifyObservable$.subscribe(res => {
      if (res.toolbarName) {
          this.fileName = res.toolbarName;
      }
      if (res.allowedUsers) {
        this.allowedUsers = res.allowedUsers.data;
        console.log("Allowed users: ", this.allowedUsers);
      }
      if (res.allUsers) {
        this.allUsers = res.allUsers.data;
        console.log("All users: ", this.allUsers);
      }
      if (res.allowedUsersUpdate) {
        this.documentService.getAllUsers();
      }
    });

    this.documentService.documentClickedEvent.subscribe((res) => {
      this.currentId = res;
    });

    // Listen to socket.
    this.socket.on("save", (save:boolean) => {
      this.typing = save;
    });
  }

  onSave() {
    this.saveEvent.emit();
  }

  onNew() {
    this.fileName = this.UNSAVED_MESSAGE;
    this.newEvent.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  onSearchChange() {
    if (this.searchInput === "") {
      this.searching = false;
    } else {
      this.searching = true;
    }
  }

  onUserClick(user:any) {
    this.documentService.addAllowedUser(this.currentId, user.username);
    this.allowedUsers.push(user.username);
    console.log(this.allowedUsers);
    this.searching = false;
    this.searchInput = "";
  }

  onAllowedUserClick(user:string) {
    const jwt_token = JSON.parse(localStorage.getItem('JWT_TOKEN') as string);
    const decodedUser = this.getDecodedJwtToken(jwt_token.accessToken);
    let idx:number = this.allowedUsers.indexOf(user);

    if (user !== decodedUser.username as string){
      this.documentService.removeAllowedUser(this.currentId, user);
      this.allowedUsers.splice(idx, 1);
    }
  }

  getDecodedJwtToken(token: string):User  {
    try{
        return jwt_decode(token);
    }
    catch(error){
        return {} as User;
    }
  }

}
