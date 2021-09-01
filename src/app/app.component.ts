import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ezy-editor';
  editorContent:any = "";

  saveDocument(arg:string) {
    if (arg === "save") {
      console.log(this.editorContent);
    }
  }
}
