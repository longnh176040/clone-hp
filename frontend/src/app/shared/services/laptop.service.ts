import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  throwError as observableThrowError,
} from "rxjs";
// import 'rxjs/add/operator/catch';
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Product } from "../models/product.model";
@Injectable({
  providedIn: "root",
})
export class LaptopService {
  private readonly LAPTOP_URL = environment.apiURL + "/laptop/";
  private readonly BLOG_URL = environment.apiURL + "/blog/";

  constructor(private http: HttpClient) {}

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  get_laptops(): Observable<any> {
    return this.http
      .get(this.LAPTOP_URL)
      .pipe(catchError(LaptopService._handleError));
  }

  get_laptop_by_id(id): Observable<any> {
    return this.http
      .get(this.LAPTOP_URL + id)
      .pipe(catchError(LaptopService._handleError));
  }

  get_many_laptop_by_id(formdata): Observable<any> {
    return this.http
      .post<any[]>(this.LAPTOP_URL + "many/by-id", formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  push_laptop_thumbnail(formdata): Observable<any> {
    return this.http
      .post(`${environment.apiURL}/push-laptop-thumbnail`, formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  push_laptop_data(formdata): Observable<any> {
    // return this.http
    //   .post(`${environment.apiURL}/push-laptop-data`, formdata)
    //   .pipe(catchError(LaptopService._handleError));
    return this.http
      .post(this.LAPTOP_URL, formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  update_laptop_thumbnails(formdata): Observable<any> {
    return this.http
      .put(this.LAPTOP_URL + "add/image", formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  edit_laptop_data(formdata, laptop_id: string): Observable<any> {
    return this.http
      .put(this.LAPTOP_URL + laptop_id, formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  delete_item_by_id(id): Observable<any> {
    return this.http
      .delete(this.LAPTOP_URL + id)
      .pipe(catchError(LaptopService._handleError));
  }

  change_item_status(id, status): Observable<any> {
    return this.http
      .get(
        this.LAPTOP_URL + "change/status?value=" + status + "&laptop_id=" + id
      )
      .pipe(catchError(LaptopService._handleError));
  }

  delete_laptop_thumbnail(formdata, laptop_id: string): Observable<any> {
    return this.http
      .put(this.LAPTOP_URL + "/image?laptop=" + laptop_id, formdata)
      .pipe(catchError(LaptopService._handleError));
  }

  rateLaptop(laptop_id: string, rate: number) {
    return this.http.get(
      this.LAPTOP_URL + "/rating?laptopId=" + laptop_id + "&rating=" + rate
    );
  }

  getBlog(laptopId: string) {
    return this.http.get(this.BLOG_URL + laptopId);
  }

  createBlog(data: any, laptopId: string) {
    return this.http.post(this.BLOG_URL + "?laptop_id=" + laptopId, data);
  }

  editBlog(data: string, laptopId: string) {
    return this.http.put(this.BLOG_URL + "?laptop_id=" + laptopId, data);
  }
}
