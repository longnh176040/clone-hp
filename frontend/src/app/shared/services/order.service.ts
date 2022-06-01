import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
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

  getOrders() {
    return this.httpClient.get(this.ORDER_URL);
  }
  getOrdersById(coverageId: string) {
    return this.httpClient.get(this.ORDER_URL  + '/' + coverageId);
  }


  getCoverage() {
    return this.httpClient.get(this.ORDER_URL + '/coverage');
  }

  getCoverageStatusByPhone(coveragePhone: string) {
    return this.httpClient.get(this.ORDER_URL + '/coverage/' + coveragePhone);
  }
  createCoverage(coverage: any) {
    return this.httpClient.post(this.ORDER_URL + '/coverage', coverage);
  }
  editCoverage(coveragePhone: string, coverage: any) {
    return this.httpClient.put(this.ORDER_URL + '/coverage/' + coveragePhone, coverage);
  }
}
