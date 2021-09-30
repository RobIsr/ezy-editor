import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { DocumentService } from '../../services/document.service';
import { SocketService } from '../../services/socket.service';
import { Socket } from 'ngx-socket-io';

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
  fileName:string = this.UNSAVED_MESSAGE; //To be displayed in toolbar when document is open.
  typing = false;

  constructor(
    private documentService: DocumentService,
    private socket: Socket,
    ) {}
  ngOnInit(): void {
    this.documentService.notifyObservable$.subscribe(res => {
      if(res.toolbarName) {
          this.fileName = res.toolbarName;
      }
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
}
