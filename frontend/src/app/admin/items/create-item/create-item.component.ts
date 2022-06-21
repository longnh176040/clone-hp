import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: "app-create-item",
  templateUrl: "./create-item.component.html",
  styleUrls: ["./create-item.component.css"],
})
export class CreateItemComponent implements OnInit {
  public mobileForm: FormGroup;
  showValidateCreate: boolean = false;
  imagePreview: string = null;
  productColor = [];
  productROM = [];
  fb;
  downloadURL$: Observable<string>;
  imgURL: any = [];
  file: any;

  public readonly colors = [
    "white",
    "black",
    "blue",
    "silver",
    "red",
    "gold",
    "pink",
    "gray",
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
    private readonly _storage: AngularFireStorage
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
      display: [null],
      battery: [null],
      gpu: [null],
      gps:[null],
      bluetooth: [null],
      OS: [null],
      price: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      sale: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      filter: this._formBuilder.group(
        {
          brand: [null],
          ram: [null],
          storage: [null],
          OS: [null],
          price_range: [null],
          size_range: [null],
          sim: [null],
        },
        ),
      imageUrls: [null],
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

  deleteImage() {
   this.imagePreview = null
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

  onFileSelected(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  uploadImage(){
    var n = Date.now();
    const filePath = `MobileImages/${n}`;
    const fileRef = this._storage.ref(filePath);
    const task = this._storage.upload(`MobileImages/${n}`, this.file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL$ = fileRef.getDownloadURL();
          this.downloadURL$.subscribe((url) => {
            if (url) {
              this.fb = url;
              this.imgURL = [...this.imgURL, url]
            }
          });
        })
      )
      .subscribe((url) => {
        if (url) {
        }
      });
  }

  onSubmit() {
    const payload = {
      ...this.mobileForm.value,
      color: this.productColor.map((item) => item),
      imageUrls: this.imgURL,
      ram: this.mobileForm.value.filter.ram,
      brand: this.mobileForm.value.filter.brand,
      storage:this.mobileForm.value.filter.storage,
      price_range: this.mobileForm.value.filter.price_range,
      size_range: this.mobileForm.value.filter.size_range,
      sim: this.mobileForm.value.filter.sim,
      OS: this.mobileForm.value.filter.OS
    }
    if (this.fb && this.productColor) {
      this._productService.createProduct(payload);
    } else {
      console.log("Đang tải ảnh lên");
    }
  }
}
