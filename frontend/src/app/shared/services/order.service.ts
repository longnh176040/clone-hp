import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CartService } from "./cart.service";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private readonly ORDER_URL = environment.apiURL + "/order";

  constructor(
    private httpClient: HttpClient,
    private _cartService: CartService
  ) {}

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  createOrder(data: any, userId: string) {
    return this.httpClient
      .post<{ msg: string; order: any }>(
        this.ORDER_URL + "?user=" + userId,
        data
      )
      .pipe(
        tap((res) => {
          this._cartService.cartSource.next([]);
          sessionStorage.removeItem("cart");
        })
      );
  }
  

  confirm_status(id, status): Observable<any> {
    return this.httpClient
      .get(
        this.ORDER_URL + "/confirm?value=" + status + "&id=" + id
      )
      .pipe(catchError(OrderService._handleError));
  }

  delete_item_by_id(id): Observable<any> {
    return this.httpClient
      .delete(this.ORDER_URL + "/" + id)
      .pipe(catchError(OrderService._handleError));
  }

  getOrders(): Observable<any> {
    return this.httpClient.get(this.ORDER_URL);
  }
  getOrdersById(coverageId: string) {
    return this.httpClient.get(this.ORDER_URL  + '/' + coverageId);
  }


  getCoverage() {
    return this.httpClient.get(this.ORDER_URL + '/coverage')
  }

  getCoverageStatusByPhone(coveragePhone: string) {
    return this.httpClient.get(this.ORDER_URL + '/coverage/' + coveragePhone);
  }
  createCoverage(coverage: any) {
    return this.httpClient.post(this.ORDER_URL + '/coverage', coverage);
  }
  editCoverage(coverageId: string, coverage: any) {
    return this.httpClient.put(this.ORDER_URL + '/coverage/' + coverageId, coverage);
  }
}
