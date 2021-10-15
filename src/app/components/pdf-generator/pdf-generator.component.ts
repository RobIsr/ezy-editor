import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.scss']
})
export class PdfGeneratorComponent {

  @Input() fileName:string = "";

  constructor(@Inject(MAT_DIALOG_DATA) data:any) {
    this.fileName = data.fileName;
  }

  save() {
    console.log(this.fileName);
  };

}

