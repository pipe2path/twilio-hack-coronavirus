import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FoundService } from '../services/found.service';
import { HttpHeaders } from '@angular/common/http';
import { Item } from '../models/itemModel';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
  providers: [ SearchService, FoundService, NgxImageCompressService]
})

export class ImageComponent implements OnInit {
  @ViewChild('canvas')
  public canvas: ElementRef;

  @ViewChild('media')
  public media: ElementRef;

  @ViewChild('img1')
  public imageEl: ElementRef;

  public items;
  public selectedItem: Item;
  public name;
  public imageFile;

  constructor(private searchService: SearchService, private foundService: FoundService, private imageCompress: NgxImageCompressService) {
    this.name = '';
    this.imageFile = null;
  }

  ngOnInit() {
    this.getRequestedItems();
    this.canvas.nativeElement.remove();
    this.selectedItem = null;
    this.name = '';
  }

  getRequestedItems(): void {
    this.searchService.getRequestedItems().subscribe(
      data => { this.items = data; }
      // err => console.error(err),
      // () => console.log('done loading requested items')
    );
  }

  onClick(item: Item, newValue) {
    this.selectedItem = item;
  }

  onSubmit(){
    const itemid = this.selectedItem.itemId;
    const submittedBy = this.name;
    //const image = this.canvas.nativeElement.toDataURL('image/jpeg');
    const image = this.imageEl.nativeElement.src;
    const response = {'itemId' : itemid, 'name': submittedBy, 'image': image};
    this.foundService.saveImageForItem(response).subscribe();
    this.ngOnInit();
  }

  compressFile(image) {
    var sizeOfOriginalImage:number;
    var sizeOFCompressedImage:number;
    var imgResultBeforeCompress:string;
    var imgResultAfterCompress:string;
    var localCompressedURl:any;
    const orientation = -1;
    sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    console.warn('Size in bytes is now:',  sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 25, 50).then(
      result => {
        imgResultAfterCompress = result;
        localCompressedURl = result;
        sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
        this.imageEl.nativeElement.src = result;
      }
    );
  }

  onFileSelected(event) {
    console.log(event);
    const that = this;
    this.imageFile = event.target.files[0];
    const context = this.canvas.nativeElement.getContext('2d');
    const canvas = this.canvas.nativeElement;
    const media = this.media.nativeElement;
    const imageEl = this.imageEl.nativeElement;
    const reader = new FileReader();
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    reader.onload = function(event){
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        imageEl.src = img.src;
        that.compressFile(imageEl.src);
      };
      img.src = reader.result;
      console.log(img.src);
    };
    reader.readAsDataURL(this.imageFile);
  }



}



