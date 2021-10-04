import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent {

  @Input() fileName:string = "";

  constructor(@Inject(MAT_DIALOG_DATA) data:any) {
    this.fileName = data.fileName;
  }

  save() {
    console.log(this.fileName);
  };

}
