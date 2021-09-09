import { Component, EventEmitter, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Output() saveEvent = new EventEmitter<string>();
  faSave = faSave;

  constructor() {}

  onSave() {
    this.saveEvent.emit("save");
  }
}
