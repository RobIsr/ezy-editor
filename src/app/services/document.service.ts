import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doc } from '../models/doc';
import {Apollo, QueryRef, gql} from 'apollo-angular';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  user:User;

  public allDocsSubscription: Subscription;
  public allDocsQuery: QueryRef<any>;

  public allowedUsersSubscription: Subscription = null as unknown as Subscription;
  public allowedUsersQuery: QueryRef<any> = null as unknown as QueryRef<any>;

  public notify = new BehaviorSubject<any>('');

  notifyObservable$ = this.notify.asObservable();

  @Output() documentClickedEvent = new EventEmitter<Doc>();

  documentClicked(currentDoc: Doc) {
    this.allowedUsersQuery = this.apollo
      .watchQuery({
        query: gql`
        {
          oneDocument(username: "${currentDoc.owner}", docId: "${currentDoc._id}") {
            allowedUsers
          }
        }
        `,
      });

    //Subscribe to graphql query to fetch all documents.
    this.allowedUsersSubscription = this.allowedUsersQuery.valueChanges.subscribe(({ data, loading }: { data: any; loading: boolean }) => {
      this.notifyOther({allowedUsers: data.oneDocument.allowedUsers});
    });
    this.documentClickedEvent.emit(currentDoc);
  }

  selectionChanged(sel:string) {
    if (sel) {
      this.notifyOther({ selection_started: true });
    } else {
      this.notifyOther({ selection_ended: true });
    }
  }

  public notifyOther(data: any) {
    if (data) {
        this.notify.next(data);
    }
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private apollo: Apollo) {
      //Get authenticated user.
      this.user = this.authService.getUser();

      this.allDocsQuery = this.apollo
      .watchQuery({
        query: gql`
        {
            allDocuments(username: "${this.user.username}") {
              _id
              owner
              allowedUsers
              name
              html
            }
          }
        `,
      });

      //Subscribe to graphql query to fetch all documents.
      this.allDocsSubscription = this.allDocsQuery.valueChanges.subscribe(({ data, loading }: { data: any; loading: boolean }) => {
        this.notifyOther({allDocs: data.allDocuments});
        this.notifyOther({loading: loading});
      });
    }

  saveDocUrl = `${environment.apiUrl}/save`;
  updateDocUrl = `${environment.apiUrl}/update`;
  updateAllowedUsersUrl = `${environment.apiUrl}/updateAllowedUsers`;
  removeAllowedUserUrl = `${environment.apiUrl}/removeAllowedUser`;
  allowedUsers = `${environment.apiUrl}/allowedUsers`;
  allUsers = `${environment.apiUrl}/allUsers`;
  generatePdfUrl = `${environment.apiUrl}/generatePdf`;
  addCommentUrl = `${environment.apiUrl}/addComment`;

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

  getAllUsers() {
    this.http.get(this.allUsers).subscribe(res => {
      this.notifyOther({allUsers: res});
    });
  }

  generatePdf(html:string) {
    this.notifyOther({generating_pdf: true});
    this.http.post(this.generatePdfUrl, { 
      "html": html 
    },
    {'responseType'  : 'blob'}).subscribe(data => {
      this.notifyOther({generating_pdf_complete: true});
      var file = new Blob([data], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }
}
