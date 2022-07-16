import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectSortBy } from 'instantsearch.js/es/connectors';


@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent extends BaseWidget implements OnInit {
  public state: {
    options: object[];
    currentRefinement: string;
    hasNoResults: boolean;
    refine: Function;
    widgetParams: object;
  }
  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('SortBy');
  }
  ngOnInit() {
    this.createWidget(connectSortBy, {
      // instance options
      items: [
        { label: 'Tất cả', value: 'products' },
        { label: 'Giá tăng dần', value: 'products_price_asc' },
        { label: 'Giá giảm dần', value: 'products_price_desc' },
      ],
    });
    super.ngOnInit();
  }
}