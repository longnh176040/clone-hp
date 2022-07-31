import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SkuService {
  private readonly SKU_URL = environment.apiURL + "/sku/";

  constructor(private http: HttpClient) {}

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  get_sku(): Observable<any> {
    return this.http
      .get(this.SKU_URL)
      .pipe(catchError(SkuService._handleError));
  }

  delete_item_by_id(id): Observable<any> {
    return this.http
      .delete(this.SKU_URL + id)
      .pipe(catchError(SkuService._handleError));
  }

  push_sku_data(formdata): Observable<any> {
    return this.http
      .post(this.SKU_URL, formdata)
      .pipe(catchError(SkuService._handleError));
  }

  edit_sku_data(formdata): Observable<any> {
    return this.http
      .put(this.SKU_URL, formdata)
      .pipe(catchError(SkuService._handleError));
  }
}
