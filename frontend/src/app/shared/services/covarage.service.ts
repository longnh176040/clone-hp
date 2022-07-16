import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovarageService {
  private readonly covarage_URL = environment.apiURL + "/oder/covarage/";

  constructor(private http: HttpClient) {}

  private static _handleError(err: HttpErrorResponse | any) {
    return observableThrowError(
      err.message || "Error: Unable to complete request."
    );
  }

  get_covarage(): Observable<any> {
    return this.http
      .get(this.covarage_URL)
      .pipe(catchError(CovarageService._handleError));
  }

  delete_item_by_id(id): Observable<any> {
    return this.http
      .delete(this.covarage_URL + id)
      .pipe(catchError(CovarageService._handleError));
  }

  push_covarage_data(formdata): Observable<any> {
    return this.http
      .post(this.covarage_URL, formdata)
      .pipe(catchError(CovarageService._handleError));
  }

  edit_covarage_data(formdata): Observable<any> {
    return this.http
      .put(this.covarage_URL, formdata)
      .pipe(catchError(CovarageService._handleError));
  }
}
