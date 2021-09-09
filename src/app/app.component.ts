import { Component } from '@angular/core';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentService } from './document.service';
import { Doc } from './models/doc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ezy-editor';
  editorContent:any = "";

  constructor(private docService: DocumentService){}

  saveDocument(arg:string) {
    if (arg === "save") {
      const document:Doc = {
        name: "New document",
        html: this.editorContent
      }
      this.docService.saveDocument(document);
    }
  }
}
