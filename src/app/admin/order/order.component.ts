import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  orders: Observable<any> = new Observable();
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders = this.orderService.getOrders()

  }

  onChange(value) {
    // console.log(value);
  }

  onClick() {
    // console.log("Success!!!");
  }
  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    // console.log(dateRangeStart.value);
    // console.log(dateRangeEnd.value);
  }
}
