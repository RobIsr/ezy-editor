import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Output() saveEvent = new EventEmitter<string>();
  faSave = faSave;

  constructor(private saveDialog: MatDialog) {}

  openSaveDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.saveDialog.open(SaveDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveEvent.emit(dialogRef.componentInstance.fileName);
      }
    });
  }

  onSave() {
    this.openSaveDialog();
  }
}
