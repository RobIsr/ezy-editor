import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { DocumentService } from '../../services/document.service';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/models/user';
import { Doc } from 'src/app/models/doc';
import { SocketService } from 'src/app/services/socket.service';
import tinymce from 'tinymce';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  UNSAVED_MESSAGE = "(Unsaved document...)";
  @Output() saveEvent = new EventEmitter();
  @Output() newEvent = new EventEmitter();
  @Output() commentEvent = new EventEmitter();
  @Output() emailEvent = new EventEmitter();
  faSave = faSave;
  faPlus = faPlus;
  faPdf = faFilePdf;
  faSignout = faSignOutAlt;
  faComment = faComment;
  faEnvelope = faEnvelope;
  fileName:string = this.UNSAVED_MESSAGE; //To be displayed in toolbar when document is open.
  typing = false;
  searchInput:string = "";
  searching:boolean = false;
  allowedUsers:any[] = [];
  allUsers = [];
  currentDoc:Doc = {} as Doc;
  user:User;
  displayPdf:boolean = false;
  generatingPdf:boolean = false;
  isOwner:boolean = false;
  isSelecting:boolean = false;
  selectedText = "";

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private socket: Socket,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
    ) {
      this.user = authService.getUser();
      this.allowedUsers = this.currentDoc.allowedUsers;
    }
  ngOnInit(): void {
    const jwt_token = JSON.parse(localStorage.getItem('JWT_TOKEN') as string);
    this.user = this.getDecodedJwtToken(jwt_token.accessToken);

    this.documentService.notifyObservable$.subscribe(res => {
      if (res.toolbarName) {
          this.fileName = res.toolbarName;
      }
      if (res.allowedUsers) {
        this.allowedUsers = res.allowedUsers;
      }
      if (res.allUsers) {
        this.allUsers = res.allUsers.data;
      }
      if (res.generating_pdf) {
        this.generatingPdf = true;
      }
      if (res.generating_pdf_complete) {
        this.generatingPdf = false;
      }
      if (res.selection_started) {
        console.log("Selection start");
        this.isSelecting = true;
        this.cdr.detectChanges();
      }
      if (res.selection_ended) {
        this.isSelecting = false;
        console.log("Selection end");
        this.cdr.detectChanges();
      }
    });

    this.documentService.documentClickedEvent.subscribe((res) => {
      this.currentDoc = res;
      this.displayPdf = true;
      if (this.user.username === this.currentDoc.owner) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }
    });

    // Listen to socket.
    this.socket.on("save", (save:boolean) => {
      this.typing = save;
    });

    this.socket.on("permission_updated", (data:any) => {
      this.allowedUsers = data;
    });
  }

  onSave() {
    this.saveEvent.emit();
  }

  onNew() {
    this.fileName = this.UNSAVED_MESSAGE;
    this.displayPdf = false;
    this.isOwner = false;
    this.newEvent.emit();
  }

  onPdf() {
    console.log("Generating PDF");
    this.documentService.generatePdf(this.currentDoc?.html as string);
  }

  onComment() {
    console.log("Adding comment...");
    this.commentEvent.emit();
  }

  onSendInvite() {
    console.log("Sending invite...");
    this.emailEvent.emit();
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
    this.socketService.addAllowedUser(this.currentDoc.owner as string, this.currentDoc._id, user.username);
    this.searching = false;
    this.searchInput = "";
    this.documentService.allowedUsersQuery.refetch();
  }

  onAllowedUserClick(user:string) {

    if (user !== this.user.username as string){
      this.socketService.removeAllowedUser(this.currentDoc.owner as string, this.currentDoc._id, user);
      this.documentService.allowedUsersQuery.refetch();
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
