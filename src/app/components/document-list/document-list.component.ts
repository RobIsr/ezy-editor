import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {

  @Output() loadEvent = new EventEmitter<string>();
  docs:any = [] // Array containing all documents.
  currentId:string = "";
  selectedDocument:string = "";
  loading:boolean = false;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    // Load all documents from database using the DocumentService.
    this.getAllDocs();

    // Subscribe to th observable to refresh list
    // when post request is completed.
    this.documentService.notifyObservable$.subscribe(res => {
      
      if(res.refreshDocs){
          this.getAllDocs();
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
   * Get all documents by sybscribing to the DocumentService.
   */
  getAllDocs() {
    this.documentService.getAllDocuments().subscribe((res) => {
      this.docs = res;
    });
  }

  /**
   * Sends clicked items html to be loaded in the editor.
   * 
   * @param id The id of clicked document.
   */
  onDocumentClick(id:string) {
    console.log(id);
    this.loadEvent.emit(id);
    this.selectedDocument = id;
  }
}
