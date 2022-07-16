import { Component, OnInit, Input } from "@angular/core";
import { LaptopService } from "src/app/shared/services/laptop.service";

@Component({
  selector: "app-star",
  templateUrl: "./star.component.html",
  styleUrls: ["./star.component.css"],
})
export class StarComponent implements OnInit {
  @Input() avarageRating = 0;
  @Input() productId: string;

  public readonly stars: number[] = [1, 2, 3, 4, 5];
  public selectedValue = 0;

  constructor(private laptopService: LaptopService) {}

  ngOnInit(): void {}

  countStar(star: number) {
    this.selectedValue = star;
    
    this.laptopService
      .rateLaptop(this.productId, this.selectedValue)
      .subscribe();
  }

  addClass(star: number) {
    let starId;
    for (let i = 0; i < star; i++) {
      starId = "star-" + i;
      document.getElementById(starId).classList.add("selected");
    }
  }
  removeClass(star: number) {
    let starId;
    for (let i = star - 1; i >= this.selectedValue; i--) {
      starId = "star-" + i;
      document.getElementById(starId).classList.remove("selected");
    }
  }
}
