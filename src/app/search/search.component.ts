import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { HttpHeaders } from '@angular/common/http';
import { Item } from '../models/itemModel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SearchService]
})
export class SearchComponent implements OnInit {

  public items;
  public itemsDisplayed;
  public itemsNeeded: Item[];
  public name;
  public phone;
  public newName;
  public newBrand;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.items = [];
    this.itemsNeeded = [];
    this.name = '';
    this.phone = '';
    this.newName = '';
    this.newBrand = '';
    this.getRequestedItems();
  }

  getRequestedItems(): void {
    this.searchService.getRequestedItems().subscribe(
      data => { this.items = data; }
      // err => console.error(err),
      // () => console.log('done loading requested items')
    );
  }

  onChange(item: Item, event) {
    if (event.target.checked){
      this.itemsNeeded.push(item);
    } else {
      for (let i = 0; i < this.itemsNeeded.length; i++) {
        if (this.itemsNeeded[i].name === item.name) {
          this.itemsNeeded.splice(i, 1);
        }
      }
    }
  }

  addNewItem() {
    // tslint:disable-next-line:triple-equals
    if (this.newName != '') {
      this.items.push({name: this.newName , brand: this.newBrand});
    }
  }

  onSubmit(){
    var response = {"items": this.itemsNeeded, "name": this.name, "phone": this.phone}
    this.searchService.saveItemsNeeded(response).subscribe();
    this.ngOnInit();
  }
}
