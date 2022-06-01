import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { Laptop } from "src/app/shared/models/laptop.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { CartService } from "src/app/shared/services/cart.service";
import { Comment } from "src/app/shared/services/comment.service";
import { GoogleAnalyticsService } from "src/app/shared/services/google-analytics.service";
import { LaptopService } from "src/app/shared/services/laptop.service";
import { environment } from "src/environments/environment";
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productColors = [];
  bucket = environment.bucket;
  series;
  similarProducts = [];
  allLaptop = [];
  public comments: Comment[];

  public laptopId: string;

  blog: any;

  thumbnailImages = [
    "../../../assets/product-detail/center_facing.png",
    "../../../assets/product-detail/left_facing.png",
    "../../../assets/product-detail/left_rear_facing.png",
    "../../../assets/product-detail/right_rear_facing.png",
    "../../../assets/product-detail/top_view_closed_facing.png",
  ];

  laptop: Laptop;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private laptopService: LaptopService,
    private authService: AuthService,
    private cartService: CartService,
    private _gaService: GoogleAnalyticsService, private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id) => {
      this.laptopService
        .get_laptop_by_id(id["id"])
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
          this.productColors = res.laptop.color;
          this.laptop = res.laptop;
          this.blog = res.blog?.content;
          this.blog = this.sanitizer.bypassSecurityTrustHtml(this.blog)
          this.laptopId = this.laptop._id;

          this.series = res.laptop.series.toLowerCase();
          this.laptopService.get_laptops().subscribe((ref) => {
            this.allLaptop = ref;
            this.similarProducts = ref.filter((laptop) => {
              return (
                laptop.series.toLowerCase() == this.series &&
                laptop.name != this.laptop.name
              );
            });
          });
        });
    });
  }

  chooseColor(id: number): void {
    const colors = Array.from(document.getElementsByClassName("color"));
    colors.forEach((color, index) => {
      if (index !== id) {
        color.classList.add("unselected");
      } else {
        color.classList.remove("unselected");
      }
    });
  }

  goToCheckout(): void {
    this.router.navigate(["checkout"]);
  }

  add_to_cart(laptop_id) {
    this.cartService.add_to_cart(laptop_id).then(() => {
      this._gaService.ecommerceEvent("add_to_cart", {
        items: [
          {
            id: this.laptop.laptop_id,
            name: this.laptop.name,
            list_name: "Click Detail",
            brand: this.laptop.brand,
            category: this.laptop.series,
            price: this.laptop.price,
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
