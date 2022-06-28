import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Product } from "../shared/models/product.model";
import { AuthService } from "../shared/services/auth.service";
import { CartService } from "../shared/services/cart.service";
import { GoogleAnalyticsService } from "../shared/services/google-analytics.service";
import { LaptopService } from "../shared/services/laptop.service";
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private laptopService: LaptopService,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private _gaService: GoogleAnalyticsService
  ) {}

  laptop: Product;
  bucket = environment.bucket;
  user_cart = [];
  value = 1;
  old_price = 0;
  sale = 0;
  amount = 0;
  isDisplayBankInfo = false;
  isDisplayReceive = false;

  ecomerceItems = [];

  ngOnInit() {
    this.old_price = 0;
    this.sale = 0;
    this.user_cart = [];
    if (AuthService.authenticated) {
      this.cartService.get_cart_by_id(AuthService.user.id).subscribe((res) => {
        this.initUserCart(res.products);
      });
    } else {
      const isServer = !isPlatformBrowser(this.platformId);
      if (!isServer) {
        this.initUserCart(this.cartService.get_anonymous_cart());
      }
    }
  }

  initUserCart(array: any[]) {
    this.cartService.currentCart.subscribe((res) => {
      res = [].concat(res);
      this.amount = 0;
      res.map((item) => {
        this.amount = this.amount + Number(item.amount);
      });
    });
    const payload = {
      id:  array.map((item) => item.product_id),
      amount: array.map((item) => item.amount)
    }
    this.productService
      .get_many_product_by_id(payload)
      .pipe(
        tap((res) => {
          if (res.length > 0) {
            res.forEach((product) => {
              this.ecomerceItems.push({
                id: product.id,
                name: product.name,
                list_name: "Click Detail",
                brand: product.brand,
                category: product.series,
                price: product.price,
                quantity: +product.amount,
              });
            });
            this._gaService.ecommerceEvent("begin_checkout", {
              items: this.ecomerceItems,
            });
          }
        })
      )
      .subscribe((res) => {
        this.user_cart = res;
        this.calculatePrice(this.user_cart);
      });
  }

  calculatePrice(user_cart) {
    this.old_price = 0;
    this.sale = 0;

    user_cart.map((product) => {
      this.old_price =
        this.old_price + Number(product.price) * Number(product.amount);
      this.sale =
        this.sale +
        (Number(product.price) - Number(product.sale)) * Number(product.amount);
    });
  }

  goToDetailPage(id): void {
    this.router.navigate(["products/" + id]);
  }

  handleMinus(id) {
    let check_product = this.user_cart.find(
      (product) => product.id == id
    );
    if (Number(check_product.amount) == 1) {
      this.remove_product_from_cart(id);
    } else {
      this.user_cart = this.user_cart.map((product) => {
        if (product.id == id) {
          product.amount = (Number(product.amount) - 1).toString();
          this._gaService.ecommerceEvent("remove_from_cart", {
            items: [
              {
                id: product.id,
                name: product.name,
                list_name: "Click Detail",
                brand: product.brand,
                category: product.series,
                price: product.price,
                quantity: 1,
              },
            ],
          });
        }
        return product;
      });
      this.calculatePrice(this.user_cart);
      this.cartService.subtract_to_cart(id);
    }
  }
  handlePlus(id) {
    this.user_cart = this.user_cart.map((product) => {
      if (product.id == id) {
        product.amount = (Number(product.amount) + 1).toString();
        this._gaService.ecommerceEvent("add_to_cart", {
          items: [
            {
              id: product.id,
              name: product.name,
              list_name: "Click Detail",
              brand: product.brand,
              category: product.series,
              price: product.price,
              quantity: 1,
            },
          ],
        });
      }
      return product;
    });
    this.calculatePrice(this.user_cart);
    this.cartService.add_to_cart(id);
  }

  remove_product_from_cart(id) {
    this.user_cart = this.user_cart.filter((product) => {
      this._gaService.ecommerceEvent("remove_from_cart", {
        items: [
          {
            id: product.id,
            name: product.name,
            list_name: "Click Detail",
            brand: product.brand,
            category: product.series,
            price: product.price,
            quantity: +product.amount,
          },
        ],
      });
      return product.id != id;
    });
    this.calculatePrice(this.user_cart);

    if (!this.authService.isAuthenticated()) {
      this.cartService.remove_in_anonymous_cart(id);
    } else {
      //update on mongodb
      const formSubmit = new FormData();
      formSubmit.append("user_id", AuthService.user.id);
      formSubmit.append("product_id", id);

      this.cartService.remove_cart_by_id(formSubmit).subscribe((res) => {
        this.cartService.cartSource.next(res.products);
      });
    }
  }
}
