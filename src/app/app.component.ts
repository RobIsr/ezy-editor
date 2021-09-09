import { Component } from '@angular/core';
import { DocumentService } from './document.service';
import { Doc } from './models/doc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ezy-editor';
  editorContent:string = "";
  fileName:string = "";

  constructor(
    private docService: DocumentService,
  ){}

  saveDocument(arg:string) {
      const document:Doc = {
        name: arg,
        html: this.editorContent
      }
      this.docService.saveDocument(document);
  }
}
