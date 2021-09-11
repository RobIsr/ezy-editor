import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';
import { DocumentService } from './document.service';
import { Doc } from './models/doc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ezy-editor';
  editorContent:string = "";
  docs:Doc[] = [];
  currentId:string = "";
  currentDoc:Doc | undefined;
  @Output() newMainEvent = new EventEmitter();

  constructor(
    private docService: DocumentService,
    private saveDialog: MatDialog
  ){}

  ngOnInit(): void {
    // Subscribe to the observable to cache loaded documents
    // when a new get request has completed in the service.
    this.docService.notifyObservable$.subscribe(res => {
      if(res.allDocs){
          this.docs = res.allDocs.data;
      }
    });
  }

  saveDocument(fileName:any) {
    const document:Doc = {
      _id: "",
      name: fileName,
      html: this.editorContent
    }
    console.log("From save: ", fileName);
    //Check to see if document needs to inserted or updated.
    if (this.currentId != "") { // If currentId is set it means that document already exists.
      this.docService.updateOneDocument(document, this.currentId);
    } else {
      this.docService.saveDocument(document);
    }
  }

  loadToEditor(id:string) {
    const document = this.docs.find(doc => doc._id === id);

    this.currentDoc = document;

    this.currentId = id; //Store id for the document currently opened.
    if (document) {
      this.editorContent = document.html;
      this.docService.notifyOther({
        toolbarName: document.name
      });
    }
  }

  newDocument() {
    this.currentId = "";
    this.editorContent = "";
    this.currentDoc = undefined;
    this.docService.notifyOther({
      new: true
    });
  }

  openSaveDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      fileName: this.currentDoc?.name
    }

    const dialogRef = this.saveDialog.open(SaveDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveDocument(dialogRef.componentInstance.fileName);
      }
    });
  }
}
