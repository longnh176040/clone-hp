import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { GoogleAnalyticsService } from "src/app/shared/services/google-analytics.service";
import { OrderService } from "src/app/shared/services/order.service";
import { UtilService } from "src/app/shared/services/util.service";
import { Converter } from "src/app/shared/utils/util.convert";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.css"],
})
export class UserInfoComponent implements OnInit {
  @Input("cart") cart: any = [];
  @Input("total_price") total_price = 0;
  @Input("ecomerceItems") ecomerceItems = [];

  public checkoutForm: FormGroup;
  public isDisplayBankInfo = false;
  public isDisplayReceive = false;

  private userId: string;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private utilService: UtilService,
    private router: Router,
    private _gaService: GoogleAnalyticsService
  ) {
    this.checkoutForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.maxLength(256)]),
      delivery_method: new FormControl(null, [Validators.required]),
      payment_method: new FormControl(null, [Validators.required]),
      products: new FormControl(null),
      total_price: new FormControl(null),
      created_at: new FormControl(null),
      created_time_stamp: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUser().id;
    if (!this.userId) {
      this.userId = "anonymous";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cart = this.cart.map((cart) => {
      return {
        amount: +cart.amount,
        laptop_id: cart.laptop_id,
      };
    });
    this.checkoutForm.patchValue({
      total_price: this.total_price,
    });
  }

  createOrder() {
    const converter = new Converter();
    const now = new Date();
    const created_at = converter.timeConvert();
    this.checkoutForm.patchValue({
      products: this.cart,
      created_at: created_at,
      created_time_stamp: now.getTime(),
    });
    this.orderService
      .createOrder(this.checkoutForm.value, this.userId)
      .subscribe((res) => {
        this._gaService.ecommerceEvent("purchase", {
          transaction_id: res.order.order_id,
          affiliation: "hp.minastik.com",
          value: res.order.total_price,
          currency: "VND",
          tax: 0,
          shipping: 0,
          items: this.ecomerceItems
        });
        this.router.navigate(["/products"]);
        this.utilService.openSnackBar(res.msg, "Thành công");
      });
  }
}
