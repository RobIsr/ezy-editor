import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  docs:any = [] // Array containing all documents.
  public currentId:string = "";
  selectedDocument:string = "";
  loading:boolean = false;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {

    // Subscribe to th observable to refresh list
    // when post request is completed.
    this.documentService.notifyObservable$.subscribe((res:any) => {
      
      if(res.allDocs) {
        this.docs = [];
        this.docs = res.allDocs.data;
        console.log("All documents: ", this.docs)
      }
      if(res.refreshDocs){
        this.documentService.getAllDocuments();
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
   * @param id The id of clicked document.
   */
  onDocumentClick(id:string) {
    console.log("Click");
    this.documentService.getAllUsers();
    this.documentService.getAllowedUsers(id);
    this.documentService.documentClicked(id);
    this.selectedDocument = id;
  }
}
