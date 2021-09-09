import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent {

  fileName:string = "";

  constructor() { }

  save(){
    console.log(this.fileName);
  };

}
