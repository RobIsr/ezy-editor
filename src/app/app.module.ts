import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { MatDialogModule } from "@angular/material/dialog";
import {  MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import { SocketService } from './services/socket.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth-interceptor';
import { AuthGuardService } from './services/auth-guard.service';
import { LayoutComponent } from './components/layout/layout.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DocumentListComponent,
    SaveDialogComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
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
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    { 
      provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js',
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    SocketService,
    AuthGuardService
  ],
  bootstrap: [LayoutComponent],
  entryComponents: [SaveDialogComponent]
})
export class AppModule { }
