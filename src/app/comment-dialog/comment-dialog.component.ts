import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent {

  @Input() comment:string = "";
  delete:boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data:any,
    private dialogRef: MatDialogRef<CommentDialogComponent>) {
    this.comment = data.comment;
    this.delete = data.delete;
  }

  save() {
    console.log(this.comment);
  };

  deleteComment() {
    this.dialogRef.close({ delete: true });
  }

}
