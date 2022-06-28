import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { UtilService } from "./util.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly CART_URL = environment.apiURL + '/cart/'
  constructor(
    private http: HttpClient,
    private readonly authService: AuthService, 
    private utilService: UtilService
  ) {}
  cartSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  currentCart = this.cartSource.asObservable();

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  get_cart_by_id(id): Observable<any> {
    //user_id
    return this.http
      .get(this.CART_URL+ id)
      .pipe(catchError(CartService._handleError));
  }

  update_cart_by_id(formdata): Observable<any> {
    return this.http
      .post(this.CART_URL, formdata)
      .pipe(catchError(CartService._handleError));
  }

  decrease_cart_by_id(formdata): Observable<any> {
    return this.http
      .put(this.CART_URL, formdata)
      .pipe(catchError(CartService._handleError));
  }

  update_anonymous_cart(product_id, method) {
    let res = this.get_anonymous_cart();
    let result = res.find((obj) => obj.product_id == product_id);
    if (result) {
      if (method == "add")
        result.amount = (Number(result.amount) + 1).toString();
      else if (method == "subtract")
        result.amount = (Number(result.amount) - 1).toString();
      for (let i = 0; i < res.length; i++) {
        if (res[i].product_id == product_id) res[i].amount = result.amount;
      }
    } else {
      res.push({
        product_id: product_id,
        amount: "1",
      });
    }
    sessionStorage.setItem("cart", JSON.stringify(res));
    this.cartSource.next(res);
  }

  remove_in_anonymous_cart(laptop_id) {
    let res = this.get_anonymous_cart();
    let result = res.filter((item) => {
      return item.product_id != laptop_id;
    });
    sessionStorage.setItem("cart", JSON.stringify(result));
    this.cartSource.next(result);
  }

  get_anonymous_cart() {
    if (sessionStorage.getItem("cart")) {
      return [].concat(JSON.parse(sessionStorage.getItem("cart")));
    } else {
      return [];
    }
  }

  remove_cart_by_id(formdata): Observable<any> {
    return this.http
      .put(this.CART_URL + 'item', formdata)
      .pipe(catchError(CartService._handleError));
  }

  add_to_cart(product_id) {
    return new Promise<any>((resolve, reject) => {
      if (this.authService.isAuthenticated()) {
        //update cart on DB
        const formSubmit = new FormData();
        formSubmit.append("user_id", AuthService.user.id);
        formSubmit.append("product_id", product_id);
        this.update_cart_by_id(formSubmit).subscribe((res) => {
          this.cartSource.next(res.products);
          this.utilService.openSnackBar("Thêm sản phẩm ", "Thành công")
          resolve(res);
        });
      } else {
        //update cart on Session Storage
        this.update_anonymous_cart(product_id, "add");
        this.utilService.openSnackBar("Thêm sản phẩm ", "Thành công")
        resolve("");
      }
    });
  }

  subtract_to_cart(product_id) {
    return new Promise<any>((resolve, reject) => {
      if (this.authService.isAuthenticated()) {
        //decrease cart on DB
        const formSubmit = new FormData();
        formSubmit.append("user_id", AuthService.user.id);
        formSubmit.append("product_id", product_id);
        this.decrease_cart_by_id(formSubmit).subscribe((res) => {
          this.cartSource.next(res.products);
          resolve("");
        });
      } else {
        //update cart on Session Storage
        this.update_anonymous_cart(product_id, "subtract");
        resolve("");
      }
    });
  }
}
