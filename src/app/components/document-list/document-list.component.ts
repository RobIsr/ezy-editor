import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Doc } from 'src/app/models/doc';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from '../../services/document.service';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  docs:any = [] // Array containing all documents.
  public currentId:string = "";
  selectedDocument:string = "";
  currentDocument:Doc = {
    _id: '',
    name: '',
    html: '',
    type: ''
  };
  loading:boolean = false;
  user:User;
  faFile = faFileAlt;
  faCode = faCode;

  constructor(
    private authService: AuthService,
    private documentService: DocumentService) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {

    // Subscribe to th observable to refresh list
    // when post request is completed.
    this.documentService.notifyObservable$.subscribe((res:any) => {
      
      if(res.allDocs) {
        this.docs = res.allDocs;
      }
      if(res.refreshDocs){
        this.documentService.allDocsQuery.refetch();
      }
      if (res.loading) {
        this.loading = true;
      } 
      if (!res.loading) {
        this.loading = false;
      } 
      if (res.new) {
        //Clear selection on list when a new document is created.
        this.selectedDocument = "";
      }
    });
  }

  /**
   * Sends clicked items html to be loaded in the editor.
   * 
   * @param doc The clicked document.
   */
  onDocumentClick(doc:Doc) {
    this.documentService.getAllUsers();
    // this.documentService.getAllowedUsers(doc._id, doc.owner as string);
    this.documentService.documentClicked(doc);
    this.currentDocument = doc;
    this.selectedDocument = doc._id;
  }
}
