import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FoundService } from '../services/found.service';
import { HttpHeaders } from '@angular/common/http';
import { Item } from '../models/itemModel';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
  providers: [ SearchService, FoundService, NgxImageCompressService]
})

export class ImageComponent implements OnInit {

  @ViewChild('img')
  public imageEl: ElementRef;

  public items;
  public selectedItem: Item;
  public name;
  public store;
  public notes;
  public imageFile;
  public hideImgElement;
  public lat: any;
  public long: any;

  constructor(private searchService: SearchService, private foundService: FoundService,
              , private imageCompress: NgxImageCompressService, private router: Router) {
    this.name = '';
    this.store = '';
    this.notes = '';
    this.imageFile = null;
    this.hideImgElement = false;
  }

  ngOnInit() {
    this.getRequestedItems();
    this.selectedItem = null;
    this.name = '';
    this.store = '';
    this.notes = '';
    this.hideImgElement = true;
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
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
    const store = this.store;
    const notes = this.notes;
    const image = this.imageEl.nativeElement.src;
    const lat = this.lat;
    const long = this.long;
    const response = {'itemId' : itemid, 'name': submittedBy, 'store': store, 'notes': notes, 'image': image, 'lat': lat, 'long': long};
    this.foundService.saveImageForItem(response).subscribe();
    this.router.navigate(['']);
    //this.ngOnInit();

  }

  onFileSelected(event) {
    const that = this;
    this.imageFile = event.target.files[0];
    const imageEl = this.imageEl.nativeElement;
    const reader = new FileReader();
    reader.onload = function(event){
      var img = new Image();
      img.onload = function() {
        imageEl.src = img.src;
        that.hideImgElement = false;
        that.compressFile(imageEl.src);
      };
      img.src = reader.result;
      console.log(img.src);
    };
    reader.readAsDataURL(this.imageFile);
  }

  // compresses the image to 25% so it can be uploaded
  compressFile(image) {
    var sizeOFCompressedImage:number;
    var imgResultAfterCompress:string;
    var localCompressedURl:any;
    const orientation = -1;
    this.imageCompress.compressFile(image, orientation, 25, 50).then(
      result => {
        imgResultAfterCompress = result;
        localCompressedURl = result;
        sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
        this.imageEl.nativeElement.src = result;
      }
    );
  }
}



