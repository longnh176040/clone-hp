import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { OrderService } from "src/app/shared/services/order.service";
import { map } from 'rxjs/operators';
import Swal from "sweetalert2";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  orders: any;
  constructor(private orderService: OrderService) {}
  search_by_phone = new FormControl("");

  ngOnInit(): void {
    this.orders = this.orderService.getOrders();
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

  change_item_status(id, status) {
    this.orderService.confirm_status(id, !status).subscribe((res) => {
      this.ngOnInit();
    });
  }

  handleDelete(id) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa đơn hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý!',
      cancelButtonText: "Hủy bỏ"
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.delete_item_by_id(id).subscribe((res) => {
          Swal.fire('Đã xóa đơn hàng!');
          this.ngOnInit();
        }); 
      }
    });
  }
}
