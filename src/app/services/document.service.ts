import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doc } from '../models/doc';
import { share, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  public notify = new BehaviorSubject<any>('');

  notifyObservable$ = this.notify.asObservable();

  @Output() documentClickedEvent = new EventEmitter<Doc>();

  documentClicked(currentDoc: Doc) {
    this.documentClickedEvent.emit(currentDoc);
  }

  public notifyOther(data: any) {
    if (data) {
        this.notify.next(data);
    }
  }

  constructor(private http: HttpClient) { }

  allDocsUrl = `${environment.apiUrl}/allDocs`;
  saveDocUrl = `${environment.apiUrl}/save`;
  updateDocUrl = `${environment.apiUrl}/update`;
  updateAllowedUsersUrl = `${environment.apiUrl}/updateAllowedUsers`;
  removeAllowedUserUrl = `${environment.apiUrl}/removeAllowedUser`;
  allowedUsers = `${environment.apiUrl}/allowedUsers`;
  allUsers = `${environment.apiUrl}/allUsers`;

  getAllDocuments() {
    this.notifyOther({loading: true});

    return this.http.get(this.allDocsUrl).pipe(share()).subscribe(data => {
      this.notifyOther({allDocs: data});
      this.notifyOther({loading: false});
    });
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

  getAllowedUsers(id:string) {
    this.http.get(this.allowedUsers + `/${id}`).subscribe(res => {
      console.log("Result: ", res);
      this.notifyOther({allowedUsers: res});
    });
  }

  getAllUsers() {
    this.http.get(this.allUsers).subscribe(res => {
      console.log("Result: ", res);
      this.notifyOther({allUsers: res});
    });
  }

  addAllowedUser(docId:string, username:string) {
    this.http.put(this.updateAllowedUsersUrl, {
      "_id": docId, 
      "user": username
    }).subscribe(data => {
      console.log(data);
      this.notifyOther({allowedUsersUpdate: true});
    })
  }

  removeAllowedUser(docId:string, username:string) {
    console.log("Request: ", username);
    this.http.put(this.removeAllowedUserUrl, {
      "_id": docId, 
      "user": username
    }).subscribe(data => {
      console.log(data);
      this.notifyOther({allowedUsersUpdate: true});
    })
  }
}
