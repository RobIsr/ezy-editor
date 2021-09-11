import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { DocumentService } from '../document.service';

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

  constructor(private documentService: DocumentService) {}
  ngOnInit(): void {
    this.documentService.notifyObservable$.subscribe(res => {
      if(res.toolbarName){
          this.fileName = res.toolbarName;
      }
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
