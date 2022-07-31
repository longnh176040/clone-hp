import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @Input() totalItemQuantity_thisWeek = 0;
  @Input() totalTransactionValue_thisWeek = 0;

  @Input() totalItemQuantity_lastWeek: number;
  @Input() totalTransactionValue_lastWeek: number;

  @Input() thisWeekOrders: any = [];
  @Input() differentTransaction: number;

  displayedColumns: string[] = ['orderId', 'totalValue', 'quantity'];
  up: boolean = true;
  different: number;
  differentValue: number;


  constructor() { }

  ngOnInit(): void {
  }

}
