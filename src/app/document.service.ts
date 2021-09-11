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
  updateDocUrl = 'https://jsramverk-editor-rois20.azurewebsites.net/update';

  getAllDocuments() {
    this.notifyOther({loading: true});

    const result = this.http.get(this.allDocsUrl);
    
    // Subscription to supply the loaded documents to other components.
    result.subscribe(data => {
      this.notifyOther({allDocs: data});
      this.notifyOther({loading: false});
    });

    console.log(result);
    return result;
  }

  saveDocument(document:Doc) {
    this.notifyOther({loading: true});
    this.http.post(this.saveDocUrl, { 
      "name": document.name,
      "html": document.html 
    }).subscribe(data => {
      this.notifyOther({loading: false});
      this.notifyOther({refreshDocs: true});
      this.notifyOther({toolbarName: document.name});
    })
  }

  updateOneDocument(document:Doc, id:string) {
    this.notifyOther({loading: true});
    this.http.put(this.updateDocUrl, {
      "_id": id, 
      "name": document.name,
      "html": document.html 
    }).subscribe(data => {
      this.notifyOther({loading: false});
      this.notifyOther({refreshDocs: true});
      this.notifyOther({toolbarName: document.name});
    })
  }
}
