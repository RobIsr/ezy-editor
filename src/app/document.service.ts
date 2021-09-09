import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Doc } from './models/doc';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  public notify = new BehaviorSubject<any>('');

  notifyObservable$ = this.notify.asObservable();

  public notifyOther(data: any) {
    if (data) {
        this.notify.next(data);
    }
  }

  constructor(private http: HttpClient) { }

  allDocsUrl = 'https://jsramverk-editor-rois20.azurewebsites.net/allDocs';
  saveDocUrl = 'https://jsramverk-editor-rois20.azurewebsites.net/save';

  getAllDocuments() {
    const result = this.http.get(this.allDocsUrl);
    console.log(result);
    return result;
  }

  saveDocument(document:Doc) {
    this.http.post(this.saveDocUrl, { 
      "name": document.name,
      "html": document.html 
    }).subscribe(data => {
      this.notifyOther({refreshDocs: true});
    })
  }
}
