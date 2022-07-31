import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { environment } from "src/environments/environment";
import { CartService } from "../../services/cart.service";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"],
})
export class ProductCardComponent implements OnInit {
  bucket = environment.bucket;

  @Input() product: any;
  @Input() comparable: boolean;

  @Output() startComparing = new EventEmitter<string>();

  compareOrRemove(product: any, event: any) {
    const element = event.target;
    if (element.innerText.toLowerCase() === "đã thêm") {
      this.onRemovingFromComparison(product, event);
    } else if (element.innerText.toLowerCase() === "thêm vào so sánh") {
      this.onAddingToCompare(product, event);
    }
  }

  onAddingToCompare(product: any, event: any) {
    const element = event.target;
    element.innerText = "Đã thêm";

    this.startComparing.emit(product);
  }

  @Output() removingFromComparison = new EventEmitter<string>();

  onRemovingFromComparison(product: any, event: any) {
    const element = event.target;
    element.innerText = "Thêm vào so sánh";
    this.removingFromComparison.emit(product);
  }

  constructor(
    private cartService: CartService,
    private _gaService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {}

  add_to_cart(laptop_id: string) {
    this.cartService.add_to_cart(laptop_id);
    this._gaService.ecommerceEvent("add_to_cart", {
      items: [
        {
          id: this.product.laptop_id,
          name: this.product.name,
          list_name: "Click Detail",
          brand: this.product.brand,
          category: this.product.series,
          price: this.product.price,
          quantity: 1,
        },
      ],
    });
  }
}