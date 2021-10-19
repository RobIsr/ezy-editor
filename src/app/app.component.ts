import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { DocumentService } from './services/document.service';
import { Doc } from './models/doc';
import { SocketService } from './services/socket.service';
import { Socket } from 'ngx-socket-io';
import tinymce from 'tinymce';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ElementSchemaRegistry } from '@angular/compiler';

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
  user:User;

  constructor(
    private authService: AuthService,
    private docService: DocumentService,
    private socketService: SocketService,
    public saveDialog: MatDialog,
    private socket: Socket
  ){
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    // Subscribe to the observable to cache loaded documents
    // when a new get request has completed in the service.
    this.docService.notifyObservable$.subscribe(res => {
      if(res.allDocs){
          this.docs = [];
          this.docs = res.allDocs;
      }
    });

    this.docService.documentClickedEvent.subscribe((res) => {
      this.currentId = res._id;
      this.loadToEditor(this.currentId);
    })

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
          content_css : "./assets/editor.css",
          setup: (editor:any) => {
            editor.on('KeyUp', () => {
              this.editorContent = editor.getBody().innerHTML;
              console.log(this.editorContent);
              this.updateSocket(editor.getBody().innerHTML);
            });
            editor.on('SelectionChange', (e: any) => {
              let selection = tinymce.activeEditor.selection.getContent();
              this.docService.selectionChanged(selection);
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
    const document:Doc = {
      _id: "",
      name: fileName,
      html: this.editorContent
    }
    
    //Check to see if document needs to inserted or updated.
    if (this.currentDoc) { // If currentId is set it means that document already exists.
      this.docService.updateOneDocument(document, this.currentDoc._id);
    } else {
      console.log("saving");
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

  addComment(comment:string) {
    this.docService.addComment(comment, this.currentId);
    this.handleComment(comment);
  }

  handleComment(comment:string) {
    tinymce.activeEditor.execCommand('HiliteColor', false, '#FFD700');
    let commentNode = tinymce.activeEditor.selection.getNode();
    let span = document.createElement("span");

    span.addEventListener("click", (event) => {
      let commentElem = tinymce.activeEditor.dom.doc.getElementById("comment") as Element;
      let normalElem = document.createElement("span");
      let tooltiptext = commentElem.getElementsByClassName("tooltiptext");

      tooltiptext[0].remove();
      commentElem.classList.remove("comment");
      normalElem.innerHTML = commentElem.innerHTML;
      
      commentElem.replaceWith(normalElem);
    });

    commentNode.className = "tooltip";
    span.className = "tooltiptext";
    span.innerHTML = "This is a comment...";

    commentNode.appendChild(span);
    commentNode.id = "comment";
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
    if(this.currentDoc) {
      this.socketService.sendMessage(
        this.currentDoc?.owner as string,
        this.currentId,
        this.currentDoc?.name as string,
        this.editorContent);
    }
  }
}
