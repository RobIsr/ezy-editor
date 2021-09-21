import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://127.0.0.1:1337', options: {} };

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DocumentListComponent } from './document-list/document-list.component';
import {MatDialogModule} from "@angular/material/dialog";
import {  MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DocumentListComponent,
    SaveDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    EditorModule,
    FontAwesomeModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    { 
      provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js',
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [SaveDialogComponent]
})
export class AppModule { }
