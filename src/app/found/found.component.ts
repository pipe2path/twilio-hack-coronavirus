import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FoundService } from '../services/found.service';
import { HttpHeaders } from '@angular/common/http';
import { Item } from '../models/itemModel';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.css'],
  providers: [ SearchService, FoundService]
})
export class FoundComponent implements OnInit {
  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  @ViewChild('media')
  public media: ElementRef;

  public captures: Array<any>;
  public items;
  public selectedItem: Item;
  public name;

  public constructor(private searchService: SearchService, private foundService: FoundService) {
    this.captures = [];
    this.name = '';
  }

  public ngOnInit() {
    this.getRequestedItems();
  }

  public ngAfterViewInit() {
    this.canvas.nativeElement.remove();
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      });
    }
  }

  public capture() {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    this.video.nativeElement.remove();
    this.media.nativeElement.appendChild(this.canvas.nativeElement);
    var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0,0, canvasWidth, canvasHeight);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
  }

  public refresh(){
    this.canvas.nativeElement.remove();
    this.media.nativeElement.appendChild(this.video.nativeElement);
    this.ngAfterViewInit();
  }

  getRequestedItems(): void {
    this.searchService.getRequestedItems().subscribe(
      data => { this.items = data; }
      // err => console.error(err),
      // () => console.log('done loading requested items')
    );
  }

  onClick(item: Item, newValue){
    this.selectedItem = item;
  }

  onSubmit() {
    const itemid = this.selectedItem.itemId;
    const submittedBy = this.name;
    const image = this.canvas.nativeElement.toDataURL('image/jpeg');
    const response = {'itemId' : itemid, 'name': submittedBy, 'image': image};

    this.foundService.saveImageForItem(response).subscribe();
  }
}
