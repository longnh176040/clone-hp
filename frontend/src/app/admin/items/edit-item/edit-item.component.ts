import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ProductService } from "../../../shared/services/product.service";

@Component({
  selector: "app-edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
})
export class EditItemComponent implements OnInit {
  public mobileForm: FormGroup;
  showValidateCreate: boolean = false;
  productColor = [];
  productROM = [];
  id: string;

  public readonly colors = [
    "Trắng",
    "Đen",
    "Xanh dương",
    "Xanh lá",
    "Bạc",
    "Đỏ",
    "Vàng",
    "Hồng",
    "Tím",
    "Xám",
  ];

  public readonly roms = [
    "16GB",
    "32GB",
    "64GB",
    "128GB",
    "256GB",
    "512GB",
    "1TB",
  ];

  public readonly rams = ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"];

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _location: Location,
    private readonly _productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mobileForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      series: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      storage: [null],
      ram: [null],
      screen_size: [null],
      screen_resolution: [null],
      price_range: [null],
      size_range: [null],
      chipset: [null],
      sim: [null],
      wifi: [null],
      camera: [null],
      webcam: [null],
      display: [null],
      battery: [null],
      weight: [null],
      gpu: [null],
      gps: [null],
      bluetooth: [null],
      dimension: [null],
      OS: [null],
      price: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      sale: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      filter: this._formBuilder.group({
        brand: [null],
        ram: [null],
        storage: [null],
        OS: [null],
        price_range: [null],
        size_range: [null],
        sim: [null],
      }),
    });

    this.activatedRoute.params.subscribe((id) => {
      this._productService
        .get_edit_product_by_id(id["id"])
        .subscribe((data) => {
          this.id = data._id
          this.productColor = data.color != null ? data.color : [];
          this.mobileForm.patchValue({
            name: data["name"],
            series: data["series"],
            storage: data["storage"],
            screen_size: data.screen_size,
            display: data.display,
            camera: data.camera,
            webcam: data.webcam,
            battery: data.battery,
            OS: data.OS,
            dimension: data.dimension,
            weight: data.weight,
            security: data.security,
            price: data.price,
            gpu: data.GPU,
            gps: data.GPS,
            sale: data.sale,
            chipset: data.chipset,
            wifi: data.wifi,
            bluetooth: data.bluetooth,
            screen_resolution: data.screen_resolution,
            filter: {
              brand: data["brand"],
              ram: data.ram,
              storage: data.storage,
              screen_size: data.screen_size,
              size_range: data.size_range,
              OS: data.OS,
              sim: data["sim"],
              price_range: data.price_range,
            },
          });
        });
    });
  }

  public screenSize: string[] = [
    " < 4.7 inch",
    "4 inch - 5 inch",
    "5 inch - 6 inch",
    "> 6.5 inch",
  ];

  public screenResolution: string[] = ["OLED", "AMOLED", "IPS LCD"];

  public storages: string[] = [
    "16GB",
    "32GB",
    "64GB",
    "128GB",
    "256GB",
    "512GB",
    "1TB",
  ];

  public priceRange: string[] = [
    "Dưới 10 triệu",
    "10 triệu - 15 triệu",
    "15 triệu - 20 triệu",
    "20 triệu - 25 triệu",
    "25 triệu - 30 triệu",
    "30 triệu - 35 triệu",
    "35 triệu - 40 triệu",
    "Trên 40 triệu",
  ];

  goBack() {
    this._location.back();
  }

  onChangeColor(event) {
    if (event.target.checked) {
      this.productColor.push(event.target.value);
    } else {
      this.productColor = this.productColor.filter(
        (item) => item != event.target.value
      );
    }
  }

  onSubmit() {
    const payload = {
      ...this.mobileForm.value,
      productId: this.id,
      color: this.productColor.map((item) => item),
      ram: this.mobileForm.value.filter.ram,
      brand: this.mobileForm.value.filter.brand,
      storage: this.mobileForm.value.filter.storage,
      price_range: this.mobileForm.value.filter.price_range,
      size_range: this.mobileForm.value.filter.size_range,
      sim: this.mobileForm.value.filter.sim,
      OS: this.mobileForm.value.filter.OS,
    };
    this._productService.edit_product_data(payload);
  }
}
