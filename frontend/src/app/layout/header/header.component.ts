import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { filter, tap } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";
import { CartService } from "src/app/shared/services/cart.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public cartService: CartService,
    public authService: AuthService
  ) { }

  anonymous_user_cart;
  amount = 0;

  showMobileMenu = false;

  ngOnInit(): void {
    const isServer = !isPlatformBrowser(this.platformId);
    if (!isServer) {
      window.addEventListener("scroll", () => {
        const headerElement = document.getElementById("header");
        const liElement = document.getElementsByClassName("desktop-nav-item");
        if (window.scrollY > 100) {
          headerElement.classList.add("sticky");
          for (let i = 0; i < liElement.length; i++) {
            liElement[i].classList.add("sticky");
          }
        } else if (window.scrollY < 100) {
          headerElement.classList.remove("sticky");
          for (let i = 0; i < liElement.length; i++) {
            liElement[i].classList.remove("sticky");
          }
        }
      });
    }


    this.cartService.currentCart.subscribe((res) => {
      res = [].concat(res);
      this.amount = 0;
      res.map((item) => {
        this.amount = this.amount + Number(item.amount);
      });
    });

    if (AuthService.authenticated) {
      this.cartService
        .get_cart_by_id(AuthService.user.id)
        .pipe(filter((cart) => cart !== null))
        .subscribe((cart) => this.cartService.cartSource.next(cart.products));
    } else {
      this.cartService.cartSource.next(this.cartService.get_anonymous_cart());
    }
  }

  doLogOut() {
    this.authService.doLogout().then((res) => {
      this.ngOnInit();
    });
  }
}
