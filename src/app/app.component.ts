import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { DocumentService } from './services/document.service';
import { Doc } from './models/doc';
import { SocketService } from './services/socket.service';
import { Socket } from 'ngx-socket-io';
import tinymce from 'tinymce';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import * as uuid from 'uuid';
import { EmailDialogComponent } from './components/email-dialog/email-dialog.component';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ezy-editor';
  editorContent:string = "";
  codeContent = "";
  codeMode = false;
  codeResult = "";
  docs:Doc[] = [];
  currentId:string = "";
  currentDoc:Doc | undefined;
  @Output() newMainEvent = new EventEmitter();
  dialogRef= "";
  commentDialogRef = null as unknown as MatDialogRef<CommentDialogComponent, any>;
  user:User;
  faRun = faPlay;
  codeExecuting = false;

  constructor(
    private authService: AuthService,
    private docService: DocumentService,
    private socketService: SocketService,
    public saveDialog: MatDialog,
    public commentDialog: MatDialog,
    public emailDialog: MatDialog,
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
      if (res.codeResult) {
        this.codeResult = res.codeResult;
      }
      if (res.codeExecuting) {
        this.codeExecuting = res.codeExecuting;
      }
    });

    this.docService.documentClickedEvent.subscribe((res) => {
      this.currentId = res._id;
      this.loadToEditor(this.currentId);
    })

    if (this.codeMode) {
      // Listen to socket.
      this.socket.on("message", (message:any) => {
        this.codeContent = message;
      });
    } else {
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
  }

  ngAfterViewInit() {
    this.activateEditor();
  }

  saveDocument(fileName:any) {
    const document:Doc = {
      _id: "",
      name: fileName,
      html: this.codeMode ? this.codeContent : this.editorContent,
      type: this.codeMode ? "code" : "text"
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
    const doc = this.docs.find(doc => doc._id === id);

    this.currentDoc = doc;
    console.log(this.currentDoc);

    this.currentId = id; //Store id for the document currently opened.
    if (doc && doc.type == "text") {
      this.codeMode = false;
      tinymce.activeEditor.setContent(doc.html);
      this.editorContent = doc.html;
      this.docService.notifyOther({
        toolbarName: doc.name
      });
      console.log(this.currentDoc?.html);
    } else if (doc && doc.type == "code") {
      this.codeMode = true;
      this.codeContent = doc.html;
      this.docService.notifyOther({
        toolbarName: doc.name
      });
    }

    this.socketService.createRoom(this.currentId);
    this.initComments();
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

  sendEmail() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.id = "email-dialog";
    dialogConfig.data = {
      email: "",
    }

    const dialogRef = this.emailDialog.open(EmailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Email to send to: ", result.email);
        this.docService.sendEmail(result.email).subscribe((res:any) => {
          //Add the email adress to allowed users on success.
          if (res.data.message === "Queued. Thank you.") {
            this.socketService.addAllowedUser(this.user.username, this.currentId, result.email);
          }
        });;
      }
    });
  }

  addComment() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.id = "comment-dialog2";
    dialogConfig.data = {
      comment: "",
      delete: false
    }
    this.commentDialogRef = this.commentDialog.open(CommentDialogComponent, dialogConfig);

    this.commentDialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.delete) {
          console.log("Deleting comment...");
        } else {
          this.handleComment(this.commentDialogRef.componentInstance.comment, this.commentDialogRef);
        }
      }
    });
    
  }

  handleComment(comment:string, _commentDialogRef: MatDialogRef<CommentDialogComponent, any> | undefined) {
    const selectionId = uuid.v4();
    let commentNodeContent = tinymce.activeEditor.selection.getContent();

    tinymce.activeEditor.selection.setContent(`<span class='highlight ${selectionId}' data-comment='${comment}'>${commentNodeContent}</span>`);

    let commentNode = tinymce.activeEditor.selection.getNode();
    let highlight = commentNode.getElementsByClassName(`${selectionId}`)[0];

    console.log(highlight);

    highlight?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.id = "comment-dialog3";
      dialogConfig.data = {
        comment: comment,
        delete: true
      }
      this.commentDialogRef = this.commentDialog.open(CommentDialogComponent, dialogConfig);

      this.commentDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.delete) {
            let selectedElem = commentNode.getElementsByClassName("highlight")[0];
            let cleanElem = document.createElement("span");

            cleanElem.innerHTML = selectedElem.innerHTML;
            selectedElem.replaceWith(cleanElem);
            this.editorContent = tinymce.activeEditor.getContent();
          } else {
            this.handleComment(result, this.commentDialogRef);
          }
        }
      });
    });

    this.editorContent = tinymce.activeEditor.getBody().innerHTML;
  }

  openSaveDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.id = "save-dialog";
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

  toggleCodeMode(codeModeSelected:boolean) {
    this.codeMode = codeModeSelected; 
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

  executeCode() {
    this.docService.executeCode(this.codeContent);
  }

  activateEditor() {
    tinymce.init(
      {
          selector: "#editor",
          base_url: './tinymce',
          content_css : "./assets/content.css",
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

  initComments() {
    let comments = tinymce.activeEditor.getBody().getElementsByClassName("highlight");
    let commentItems = Array.from(comments);

    commentItems.forEach((elem) => {
      elem.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(elem);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.id = "comment-dialog1";
        dialogConfig.data = {
          comment: elem.attributes.getNamedItem("data-comment")?.value,
          delete: true
        }

        this.commentDialogRef = this.commentDialog.open(CommentDialogComponent, dialogConfig);

        this.commentDialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.delete) {
              let cleanElem = document.createElement("span");

              cleanElem.innerHTML = elem.innerHTML;
              elem.replaceWith(cleanElem);
              this.editorContent = tinymce.activeEditor.getContent();
            } else {
              this.handleComment(result, this.commentDialogRef);
            }
          }
        });
      });
    });
  }
}
