import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  isTouched = false;
  touchedStartX: number = null;
  touchedEndX: number = null;
  laptops = [];
  dealList = [];
  bestList= [];
  promotionList = []

  constructor() { }

  ngOnInit(): void {
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
