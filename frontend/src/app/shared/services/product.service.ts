import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _httpClient: HttpClient) { }
  private readonly api_porduct = environment.apiURL + "/product/";

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  createProduct(payload): void {
    this._httpClient.post<{msg: string}>(this.api_porduct, payload).subscribe(data => {
      console.log(data.msg);
    }, err => console.error(err.error.msg));
  }

  get_product(): Observable<any> {
    return this._httpClient
      .get(this.api_porduct)
      .pipe(catchError(ProductService._handleError));
  }


  delete_item_by_id(id): Observable<any> {
    return this._httpClient
      .delete(this.api_porduct + id)
      .pipe(catchError(ProductService._handleError));
  }

  change_item_status(id, status): Observable<any> {
    return this._httpClient
      .get(
        this.api_porduct + "change/status?value=" + status + "&id=" + id
      )
      .pipe(catchError(ProductService._handleError));
  }

  get_product_by_id(id): Observable<any> {
    return this._httpClient
      .get(this.api_porduct + id)
      .pipe(catchError(ProductService._handleError));
  }

  get_edit_product_by_id(id): Observable<any> {
    return this._httpClient
      .get(this.api_porduct + "edit/" + id)
      .pipe(catchError(ProductService._handleError));
  }

  get_many_product_by_id(formdata): Observable<any> {
    return this._httpClient
      .post<any[]>(this.api_porduct + "many/by-id", formdata)
      .pipe(catchError(ProductService._handleError));
  }


}
