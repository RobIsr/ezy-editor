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

  docs:any = []

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.getAllDocs();
    this.documentService.notifyObservable$.subscribe(res => {
      if(res.refreshDocs){
          console.log("refreshing");
          this.getAllDocs();
      }
    });
  }

  getAllDocs() {
    this.documentService.getAllDocuments().subscribe((res) => {
      this.docs = res;
      console.log("Docs: ", this.docs);
    });
  }
}
