import {
  AfterViewInit,
  Component, OnInit
} from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { Product } from "src/app/shared/models/product.model";
import { CartService } from "src/app/shared/services/cart.service";
import { Comment } from "src/app/shared/services/comment.service";
import { GoogleAnalyticsService } from "src/app/shared/services/google-analytics.service";
import { LaptopService } from "src/app/shared/services/laptop.service";
import { ProductService } from "src/app/shared/services/product.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productColors = [];
  bucket = environment.bucket;
  brand;
  similarProducts = [];
  public comments: Comment[];

  public productId: string;

  blog: any;
  product: Product;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private laptopService: LaptopService,
    private productService: ProductService,
    private cartService: CartService,
    private _gaService: GoogleAnalyticsService, private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id) => {
      this.productService
        .get_product_by_id(id["id"])
        .pipe(
          tap((p) => {
            const data = [
              {
                id: p.laptop_id,
                name: p.name,
                list_name: "Click Detail",
                brand: p.brand,
                category: p.series,
                price: p.price,
              },
            ];
            this._gaService.ecommerceEvent("view_item", {
              items: data,
            });
          })
        )
        .subscribe((res) => {
          this.productColors = res.product.color;
          this.product = res.product;
          this.blog = res.blog ? res.blog.content : "<p>Đang cập nhật</p>";
          this.blog = this.sanitizer.bypassSecurityTrustHtml(this.blog)
          this.productId = this.product._id;

          this.brand = res.product.brand.toLowerCase();
          this.productService.get_product().subscribe((ref) => {
            this.similarProducts = ref.filter((product) => {
              return (
                product.brand.toLowerCase() == this.brand &&
                product.name != this.product.name
              );
            });
          });
        });
    });
  }

  chooseColor(id: number): void {
    const colors = Array.from(document.getElementsByClassName("filter-color"));
    colors.forEach((color, index) => {
      if (index === id) {
        color.classList.add("selected");
      } else {
        color.classList.remove("selected");
      }
    });
  }

  goToCheckout(): void {
    this.router.navigate(["checkout"]);
  }

  add_to_cart(id) {
    this.cartService.add_to_cart(id).then(() => {
      this._gaService.ecommerceEvent("add_to_cart", {
        items: [
          {
            id: this.product._id,
            name: this.product.name,
            list_name: "Click Detail",
            brand: this.product.brand,
            category: this.product.series,
            price: this.product.price,
            quantity: 1,
          },
        ],
      });
      this.goToCheckout();
    });
  }

  getComments(cmts: Comment[]) {
    this.comments = cmts;
  }

  goToComment(tabGroup: MatTabGroup, comment) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    tabGroup.selectedIndex = 2;
    comment.scrollIntoView();
  }
}
