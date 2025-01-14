import { Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AuthService } from "src/app/shared/services/auth.service";
import { CartService } from "src/app/shared/services/cart.service";
import { LaptopService } from "src/app/shared/services/laptop.service";
import algoliasearch from "algoliasearch/lite";
import { environment } from "src/environments/environment";
import { GoogleAnalyticsService } from "src/app/shared/services/google-analytics.service";

const searchClient = algoliasearch(
  "FKYKG6XW0M",
  "a2329f11e8a305675fdcb4b9c7e1851a"
);
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  @ViewChildren("product") productComponents: any;
  @ViewChildren("productHTML") productElements: any;
  public config = {
    indexName: "products",
    searchClient,
  };

  public bucket = environment.bucket;
  public compareList = [];
  public showMobileFiters = false;
  public onComparing: boolean;

  constructor(
    private laptopService: LaptopService,
    private cartService: CartService,
    private authService: AuthService, private _gaService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    if (window.innerWidth > 1200) {
      this.onComparing = true;
    } else {
      this.onComparing = false;
    }

    // this.cartService.get_cart_by_id(AuthService.user.id).subscribe((res) => {
    //   // console.log(res);
    // });
  }


  activateFilter(id: number) {
    const filters = Array.from(document.getElementsByClassName("filter"));
    const selectedFilter = filters[id];
    selectedFilter.classList.toggle("active");
  }

  addToCompare(laptop) {
    if (this.compareList.length < 3) {
      if (!this.compareList.includes(laptop)) {
        this.compareList.push(laptop);
      }
    }
  }

  removeComparedItem(id: number, index?: number) {
    this.compareList.splice(index, 1);
    this.compareList.filter((laptop) => {
      if (laptop.id === id) return false;
      else return true;
    });
    const productComponents = this.productComponents._results;
    console.log(productComponents)
    const productElements = this.productElements._results;

    const correspondingComponentId = productComponents.findIndex(
      (component) => component.product.id === id
    );
    console.log(correspondingComponentId)
    productElements[correspondingComponentId].nativeElement.querySelector(
      ".compare"
    ).innerText = "Thêm vào so sánh";
  }

  clearComparedItems() {
    const productData = [].concat(this.compareList);
    productData.forEach((product, index) => {
      this.removeComparedItem(product.id, index);
    });
    this.compareList = [];
  }

  transformSeriesName(items) {
    return items.map((item) => ({
      ...item,
      highlighted:
        item.highlighted[0].toUpperCase() + item.highlighted.slice(1),
    }));
  }

  showComparison(): void {
    if (this.compareList.length > 0) {
      this.onComparing = true;
    }
  }

}
