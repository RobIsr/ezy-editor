import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { DocumentService } from './services/document.service';
import { Doc } from './models/doc';
import { SocketService } from './services/socket.service';
import { Socket } from 'ngx-socket-io';
import tinymce from 'tinymce';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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
  dialogRef= "";

  constructor(
    private docService: DocumentService,
    private socketService: SocketService,
    private authService: AuthService,
    public saveDialog: MatDialog,
    private socket: Socket,
  ){}

  ngOnInit(): void {
    this.docService.getAllDocuments();
    // Subscribe to the observable to cache loaded documents
    // when a new get request has completed in the service.
    this.docService.notifyObservable$.subscribe(res => {
      if(res.allDocs){
          this.docs = [];
          this.docs = res.allDocs.data;
      }
    });

    // Listen to socket.
    this.socket.on("message", (message:any) => {
      this.editorContent = message;
      // Set the editor content to that recieved from socket.
      tinymce.activeEditor.setContent(this.editorContent);
      // Set position of marker to end of content
      tinymce.activeEditor.focus();
      tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
      tinymce.activeEditor.selection.collapse(false);
    });
  }

  ngAfterViewInit() {
    tinymce.init(
      {
          selector: "#editor",
          base_url: './tinymce',
          setup: (editor:any) => {
            editor.on('KeyUp', () => {
              this.editorContent = editor.getBody().innerHTML;
              this.updateSocket(editor.getBody().innerHTML);
            });
          },
          suffix: '.min',
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
      });
  }

  saveDocument(fileName:any) {
    console.log("From save: ");
    const document:Doc = {
      _id: "",
      name: fileName,
      html: this.editorContent
    }
    
    //Check to see if document needs to inserted or updated.
    if (this.currentId != "") { // If currentId is set it means that document already exists.
      this.docService.updateOneDocument(document, this.currentId);
    } else {
      console.log("Calling save in service");
      this.docService.saveDocument(document);
    }
  }

  loadToEditor(id:string) {
    const document = this.docs.find(doc => doc._id === id);

    this.currentDoc = document;

    this.currentId = id; //Store id for the document currently opened.
    if (document) {
      tinymce.activeEditor.setContent(document.html);
      this.editorContent = document.html;
      this.docService.notifyOther({
        toolbarName: document.name
      });
    }
    this.socketService.createRoom(this.currentId);
  }

  newDocument() {
    this.currentId = "";
    this.editorContent = "";
    tinymce.activeEditor.setContent("");
    this.currentDoc = undefined;
    this.docService.notifyOther({
      new: true
    });
  }

  openSaveDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.id = "save-dialog";
    dialogConfig.data = {
      fileName: this.currentDoc?.name
    }
    console.log("Opening Dialog!")
    const dialogRef = this.saveDialog.open(SaveDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Result", result);
        this.saveDocument(dialogRef.componentInstance.fileName);
      }
    });
  }

  updateSocket(editorContent:any) {
    console.log(editorContent);
    var doc = this.currentDoc as Doc
    this.socketService.sendMessage(this.currentId, doc.name, editorContent);
  }
}
