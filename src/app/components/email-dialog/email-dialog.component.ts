import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent {

  @Input() email:string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) data:any,
    private dialogRef: MatDialogRef<EmailDialogComponent>) {
    this.email = data.email;
  }

  sendInvite() {
    console.log("Email: ", this.email);
    this.dialogRef.close({ email: this.email });
  };
}
