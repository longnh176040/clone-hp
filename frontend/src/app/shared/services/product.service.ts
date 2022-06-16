import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _httpClient: HttpClient) { }
  private readonly api_porduct = environment.apiURL + "/product/";
  createProduct(formData): void {
    this._httpClient.post<{msg: string}>(this.api_porduct, formData).subscribe(data => {
      console.log(data.msg);
    }, err => console.error(err.error.msg));
  }

  deleteProduct(id: string): void{
    this._httpClient.delete(this.api_porduct + '/' + id).subscribe(() => {
    });
  }
}
