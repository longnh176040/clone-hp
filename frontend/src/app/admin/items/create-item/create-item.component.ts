import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LaptopService } from "src/app/shared/services/laptop.service";
import { imagesValidator } from '../../../shared/validator/images-mime-type.validator';

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
  mobileImage: FileList = null;
  images: Array<{ id: number; File: File }> = [];
  imageUrls: Array<{ id: number; url: string }> = [];

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
    private readonly _productService: LaptopService,
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
      OS: [null],
      price: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      sale: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      filter: [
        {
          brand: [null],
          ram: [null],
          storage: [null],
          OS: [null],
          price_range: [null],
          size_range: [null],
          sim: [null],
        },
      ],
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

  onImagePicked(event: Event): void {
    const files = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(files);
  }

  goBack() {
    this._location.back();
  }

  deleteImage(imageUrl: any, id: number) {
    if (imageUrl.slice(0, 5) === 'data:') {
      this.images = this.images.filter((image) => {
        return image.id !== id;
      });
      this.imageUrls = this.imageUrls.filter((image) => {
        return image.id !== id;
      });
      this.mobileForm.patchValue({
        imageUrls: this.imageUrls,
      });
    }
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

  // onFileSelected(event) {
  //   var n = Date.now();
  //   const file = (event.target as HTMLInputElement).files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);

  //   const filePath = `MobileImages/${n}`;
  //   const fileRef = this._storage.ref(filePath);
  //   const task = this._storage.upload(`MobileImages/${n}`, file);
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         this.downloadURL$ = fileRef.getDownloadURL();
  //         this.downloadURL$.subscribe((url) => {
  //           if (url) {
  //             this.fb = url;
  //           }
  //         });
  //       })
  //     )
  //     .subscribe((url) => {
  //       if (url) {
  //       }
  //     });
  // }


  
  
  onFileSelected(event): void {    
    const n = Date.now();
    if(event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for(let i = 0; i< filesAmount; i++) {
        const file = (event.target as HTMLInputElement).files[i];
        const fileReader = new FileReader();
        imagesValidator(file).subscribe(() => {
          fileReader.onload = (readedFile: any) => {
            const now = Date.now();
            this.imageUrls.push({
              id: now,
              url: readedFile.target.result as string,
            });
            this.mobileForm.patchValue({
              imageUrls: this.imageUrls,
            });
            this.images.push({
              id: now,
              File: event.target.files[i],
            });
          };
          fileReader.readAsDataURL(event.target.files[i]);
        });
      }
    }
  }

  onSubmit() {
    const formSubmit = new FormData();
    formSubmit.append("name", this.mobileForm.value.productName);
    formSubmit.append("brand", this.mobileForm.value.brand);
    this.productColor.map((item) => formSubmit.append("color", item));
    formSubmit.append("ram", this.mobileForm.value.ram);
    formSubmit.append("desc", this.mobileForm.value.desc);
    formSubmit.append("price", this.mobileForm.value.price);
    formSubmit.append("sale", this.mobileForm.value.sale);
    formSubmit.append("imageUrls", this.fb);
    if (this.fb && this.productColor && this.productROM) {
      this._productService.push_laptop_data(formSubmit);
      window.location.reload();
    } else {
      console.log("Đang tải ảnh lên");
    }
  }
}
