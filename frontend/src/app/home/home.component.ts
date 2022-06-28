import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductService } from '../shared/services/product.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isTouched = false;
  touchedStartX: number = null;
  touchedEndX: number = null;
  products = [];
  dealList = [];
  bestList= [];
  promotionList = []

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.get_product().subscribe(res => {
      this.products = res;
      this.dealList = this.products.slice(0,4);
      this.bestList = this.products.slice(4,8);
      this.promotionList = this.products.slice(8,12)
      
    })
  }

  touchStart(event: any): void {
    this.isTouched = true;
    this.touchedStartX = event.changedTouches[0].clientX;
  }

  touchEnd(event: any): void {
    this.isTouched = false;
    this.touchedEndX = event.changedTouches[0].clientX;
    if (this.touchedStartX > this.touchedEndX) {
      $('.carousel').carousel('next');
    }
    else if (this.touchedStartX < this.touchedEndX) {
      $('.carousel').carousel('prev');
    }
  }

}
