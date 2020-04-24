import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FoundService } from '../services/found.service';
import { HttpHeaders } from '@angular/common/http';
import { Item } from '../models/itemModel';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
  providers: [ SearchService, FoundService]
})

export class ImageComponent implements OnInit {
  @ViewChild('canvas')
  public canvas: ElementRef;

  @ViewChild('media')
  public media: ElementRef;

  public items;
  public selectedItem: Item;
  public name;
  public imageFile;

  constructor(private searchService: SearchService, private foundService: FoundService) {
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

  onFileSelected(event) {
    console.log(event);
    this.imageFile = event.target.files[0];
    const context = this.canvas.nativeElement.getContext('2d');
    const canvas = this.canvas.nativeElement;
    const media = this.media.nativeElement;
    const reader = new FileReader();
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    reader.onload = function(event){
      var img = new Image();
      img.onload = function() {
        context.drawImage(img, 0, 0, height, width);
        //this.thumbnailer(canvas, img, 188, 3);
        media.appendChild(canvas);
      };
      // img.addEventListener('onload', function(e) {
      //   this.thumbnailer(canvas, img, 188, 3);
      //   media.appendChild(canvas);
      // })
      img.src = reader.result;
    };
    reader.readAsDataURL(this.imageFile);
  }

  onSubmit(){
    const itemid = this.selectedItem.itemId;
    const submittedBy = this.name;
    const image = this.canvas.nativeElement.toDataURL('image/jpeg');
    const response = {'itemId' : itemid, 'name': submittedBy, 'image': image};

    this.foundService.saveImageForItem(response).subscribe();
    this.ngOnInit();
  }

  // returns a function that calculates lanczos weight
  lanczosCreate(lobes) {
    return function(x) {
      if (x > lobes)
        return 0;
      x *= Math.PI;
      if (Math.abs(x) < 1e-16)
        return 1;
      var xx = x / lobes;
      return Math.sin(x) * Math.sin(xx) / x / xx;
    };
  }

// elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
  thumbnailer(elem, img, sx, lobes) {
    this.canvas = elem;
    elem.width = img.width;
    elem.height = img.height;
    elem.style.display = "none";
    const ctx = elem.getContext("2d");
    ctx.drawImage(img, 0, 0);
    //this.img = img;
    const src = ctx.getImageData(0, 0, img.width, img.height);
    const dest = {
      width : sx,
      height : Math.round(img.height * sx / img.width),
    };
    const dest_data = new Array(dest.width * dest.height * 3);
    const lanczos = this.lanczosCreate(lobes);
    const ratio = img.width / sx;
    const rcp_ratio = 2 / ratio;
    const range2 = Math.ceil(ratio * lobes / 2);
    const cacheLanc = {};
    const center = {};
    const icenter = {};
    this.thumbnailerProcess1(this, 0);
  }

  thumbnailerProcess1(self, u) {
    self.center.x = (u + 0.5) * self.ratio;
    self.icenter.x = Math.floor(self.center.x);
    for (var v = 0; v < self.dest.height; v++) {
      self.center.y = (v + 0.5) * self.ratio;
      self.icenter.y = Math.floor(self.center.y);
      var a, r, g, b;
      a = r = g = b = 0;
      for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
        if (i < 0 || i >= self.src.width)
          continue;
        var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
        if (!self.cacheLanc[f_x])
          self.cacheLanc[f_x] = {};
        for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
          if (j < 0 || j >= self.src.height)
            continue;
          var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
          if (self.cacheLanc[f_x][f_y] == undefined)
            self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2)
              + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
          var weight = self.cacheLanc[f_x][f_y];
          if (weight > 0) {
            var idx = (j * self.src.width + i) * 4;
            a += weight;
            r += weight * self.src.data[idx];
            g += weight * self.src.data[idx + 1];
            b += weight * self.src.data[idx + 2];
          }
        }
      }
      var idx = (v * self.dest.width + u) * 3;
      self.dest.data[idx] = r / a;
      self.dest.data[idx + 1] = g / a;
      self.dest.data[idx + 2] = b / a;
    }

    if (++u < self.dest.width)
      setTimeout(this.thumbnailerProcess1, 0, self, u);
    else
      setTimeout(this.thumbnailerProcess2, 0, self);
  }

  thumbnailerProcess2 = function(self) {
    self.canvas.width = self.dest.width;
    self.canvas.height = self.dest.height;
    self.ctx.drawImage(self.img, 0, 0, self.dest.width, self.dest.height);
    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
    var idx, idx2;
    for (var i = 0; i < self.dest.width; i++) {
      for (var j = 0; j < self.dest.height; j++) {
        idx = (j * self.dest.width + i) * 3;
        idx2 = (j * self.dest.width + i) * 4;
        self.src.data[idx2] = self.dest.data[idx];
        self.src.data[idx2 + 1] = self.dest.data[idx + 1];
        self.src.data[idx2 + 2] = self.dest.data[idx + 2];
      }
    }
    self.ctx.putImageData(self.src, 0, 0);
    self.canvas.style.display = "block";
  }



}



