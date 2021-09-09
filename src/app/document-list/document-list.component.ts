import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../document.service';
import { MessageService } from '../message.service';
import { Doc } from '../models/doc';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {

  docs:any = [] // Array containing all documents.

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    // Load all documents from database using the DocumentService.
    this.getAllDocs();

    // Subscribe to th observable to refresh list
    // when post request is completed.
    this.documentService.notifyObservable$.subscribe(res => {
      if(res.refreshDocs){
          console.log("refreshing");
          this.getAllDocs();
      }
    });
  }

  /**
   * Get all documents by sybscribing to the DocumentService.
   */
  getAllDocs() {
    this.documentService.getAllDocuments().subscribe((res) => {
      this.docs = res;
      console.log("Docs: ", this.docs);
    });
  }

  /**
   * Sends clicked items html to be loaded in the editor.
   * 
   * @param id The id of clicked document.
   */
  onDocumentClick(id:string) {
    console.log(id);
  }
}
