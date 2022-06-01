import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LaptopService } from '../shared/services/laptop.service';

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
  laptops = [];
  dealList = [];
  bestList= [];
  promotionList = []

  bucket = environment.bucket;


  productsList = [
    {
      name: 'OMEN 15 (2020 Intel)', originalPrice: '25.000.000', salePrice: '20.000.000', discount: '15%', imgLink: 'https://store.hp.com/app/assets/images/product/8RG19AV_1/center_facing.png?_=1591088008299&imwidth=570&imdensity=1', briefDesc: 'Sweet 15.6” screen\nNVIDIA® GeForce RTX™ 2080 Max - Q graphics\n9th generation Intel® Core™ i9 processor\n16 GB memory, 1TB SSD storage', onSale: true
    },
    { name: 'OMEN 17', originalPrice: '25.000.000', salePrice: '20.000.000', discount: '15%', imgLink: 'https://store.hp.com/app/assets/images/product/17H50AV_1/center_facing.png?_=1591781827348&imwidth=570&imdensity=1', briefDesc: 'Stunning 17.3 screen\nNVIDIA® GeForce RTX™ 2080\n9th generation Intel® Core™ i9 processor\n16 GB memory, 1TB SSD storage', onSale: true },
    {
      name: 'HP Elite Dragonfly', originalPrice: '25.000.000', salePrice: '20.000.000', discount: '15%', imgLink: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06453677.png?imwidth=278&imdensity=1', briefDesc: 'Micro Edge 13.3” UHD touch screen\nIntel UHD Graphics 8th generation Intel® Core™ vPro processor\n16 GB memory, 1TB SSD storage\nSuper light- weight - Under 1kg', onSale: true
    },
    { name: 'HP Spectre X360 13', originalPrice: '25.000.000', salePrice: '20.000.000', discount: '15%', imgLink: 'https://store.hp.com/app/assets/images/product/2C5A6UA%23ABA/center_facing.png?_=1602667371454&imwidth=270&imdensity=1', briefDesc: 'Micro Edge 13.3” UHD touch screen\nIntel UHD Graphics 8th generation Intel® Core™ vPro processor\n16 GB memory, 1TB SSD storage\nSuper light- weight - Under 1kg', onSale: true }
  ];

  constructor(private laptopService: LaptopService) { }

  ngOnInit(): void {
    this.laptopService.get_laptops().subscribe(res => {
      this.laptops = res;
      this.dealList = this.laptops.slice(0,4);
      this.bestList = this.laptops.slice(4,8);
      this.promotionList = this.laptops.slice(8,12)
      
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
