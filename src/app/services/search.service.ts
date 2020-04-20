import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Item } from '../models/itemModel';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {
  }

  itemsUrl = environment.apiUrl + '/items';

  getRequestedItems() {
    const items = this.http.get(this.itemsUrl).pipe(catchError(this.handleError));
    return items;
  }

  saveItemsNeeded(response): Observable<any> {
    // const bodyObj = new Object();
    // bodyObj.name = name;
    // bodyObj.phone = phone;
    // bodyObj.items  = JSON.stringify(items);
    // const body = JSON.stringify(bodyObj);
    const body = JSON.stringify(response);

    return this.http.post(this.itemsUrl, body, httpOptions)
            .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return 'Something bad happened; please try again later.';
  }
}
