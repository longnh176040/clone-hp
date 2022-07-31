import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Laptop } from "src/app/shared/models/laptop.model";
import { GetCoreNamePipe } from "src/app/shared/pipe/get-core-name.pipe";
import { SpaceToUnderscorePipe } from "src/app/shared/pipe/space-to-underscore.pipe";
import { LaptopService } from "src/app/shared/services/laptop.service";
import { Converter } from "src/app/shared/utils/util.convert";
import { environment } from "src/environments/environment";
import * as _collection from "lodash/collection";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
})
export class ItemsComponent implements OnInit {
  showThumbnails: string[] = [];
  public thumbnails: string[] = [];
  public readonly bucket = environment.bucket;
  public readonly allColors = [
    "white",
    "black",
    "blue",
    "silver",
    "pink",
    "gold",
  ];

  private convert: Converter = new Converter();
  public laptop_id: string;

  public needs: string[] = [
    "Laptop Gaming",
    "Mỏng nhẹ, văn phòng",
    "Phổ thông, văn phòng",
    "Đồ hoạ, kỹ thuật",
  ];

  public cpus: string[] = [
    "Intel Celeron/Pentium",
    "Intel Core i3",
    "Intel Core i5",
    "Intel Core i7",
    "Intel Core i9",
    "AMD Ryzen 3",
    "AMD Ryzen 5",
    "AMD Ryzen 7",
  ];

  public rams: string[] = ["4GB", "8GB", "16GB", "32GB"];

  public storages: string[] = [
    "500GB HDD",
    "1T HDD",
    "256GB SSD",
    "512GB SSD",
    "1T SSD",
    "2T SSD",
  ];

  public vgas: string[] = ["VGA Onboard", "VGA NVDIA", "VGA AMD"];

  public screenSize: string[] = [
    "12.5 inch",
    "13.3 inch",
    "14 inch",
    "15.6 inch",
    "> 15.6 inch",
  ];

  public screenResolution: string[] = [
    "HD (1366x768)",
    "Full HD (1920x1080)",
    "2K (2560x1440)",
    "4K (3840x2160)",
  ];

  public oss: string[] = ["Win 10", "DOS"];

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


  productColor = [];
  showLaptop: Laptop;
  search_by_name = new FormControl("");
  edit_product_id;
  drawer_state;
  currentLaptopThumbnail: FileList = null;
  laptops: Laptop[];
  visible = false;
  formCreateProduct: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    series: new FormControl(null, [Validators.required]),
    CPU_name: new FormControl(""),
    CPU_speed: new FormControl(""),
    CPU_cache: new FormControl(""),
    RAM_capacity: new FormControl(""),
    RAM_socket_number: new FormControl(""),
    storage: new FormControl(""),
    display: new FormControl(""),
    graphic: new FormControl(""),
    wireless: new FormControl(""),
    LAN: new FormControl(""),
    connection_USB: new FormControl(""),
    connection_HDMI_VGA: new FormControl(""),
    keyboard: new FormControl(""),
    webcam: new FormControl(""),
    audio: new FormControl(""),
    battery: new FormControl(""),
    OS: new FormControl(""),
    dimension: new FormControl(""),
    weight: new FormControl(""),
    security: new FormControl(""),
    need: new FormControl(""),
    vga: new FormControl(""),
    price: new FormControl(null, [Validators.required]),
    sale: new FormControl(null, [Validators.required]),
    filter: new FormGroup({
      vga: new FormControl(),
      need: new FormControl(),
      cpu: new FormControl(),
      ram: new FormControl(),
      storage: new FormControl(),
      screen_size: new FormControl(),
      screen_resolution: new FormControl(),
      os: new FormControl(),
      price_range: new FormControl(),
    }),
  });

  listToDelete = [];
  visible_thumbnail = true;
  create_type;
  imgURL = [];

  @ViewChild("mySidenav") mySidenav: ElementRef;

  @ViewChild("canvas", { static: false }) set content(content: ElementRef) {
    if (content) {
      this.mySidenav.nativeElement.style.width = "600px";
      this.mySidenav.nativeElement.style.height = "100%";
    } else {
      this.mySidenav.nativeElement.style.width = "0";
      this.mySidenav.nativeElement.style.height = "0";
    }
  }

  constructor(
    private laptopService: LaptopService,
    private spaceToUnderscore: SpaceToUnderscorePipe,
    private getCoreName: GetCoreNamePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.laptopService.get_laptops().subscribe((res) => {
      this.laptops = res;
      let filterLaptop = res;
      this.search_by_name.valueChanges.subscribe((ref) => {
        if (ref.trim() == "") {
          filterLaptop = res;
        } else {
          filterLaptop = filterLaptop.filter((item) => {
            return (
              item.name
                .toLowerCase()
                .search(
                  ref.trim().split(" ").join("").toLowerCase().slice(-1)
                ) != -1
            );
          });
        }
        this.laptops = filterLaptop;
      });
    });
  }

  sortByName() {
    this.laptops.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  deSortByName() {
    this.laptops.sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortByBrand() {
    this.laptops.sort((a, b) => {
      let nameA = a.brand.toLowerCase();
      let nameB = b.brand.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  deSortByBrand() {
    this.laptops.sort((a, b) => {
      let nameA = a.brand.toLowerCase();
      let nameB = b.brand.toLowerCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortByCPU() {
    this.laptops.sort((a, b) => {
      let nameA = this.getCoreName.transform(a.CPU.name, "CPU");
      let nameB = this.getCoreName.transform(b.CPU.name, "CPU");
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  deSortByCPU() {
    this.laptops.sort((a, b) => {
      let nameA = this.getCoreName.transform(a.CPU.name, "CPU");
      let nameB = this.getCoreName.transform(b.CPU.name, "CPU");
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  // open create product
  open_create_product(value) {
    this.formCreateProduct.reset();
    this.productColor = [];
    this.imgURL = [];
    this.drawer_state = "Create";
    this.currentLaptopThumbnail = null;
    this.visible = true;
    this.create_type = value;
  }
  // close create product
  close_create_product() {
    this.drawer_state = null;
    this.visible = false;
  }
  // open edit product
  open_edit_product(laptop, value) {
    this.productColor = laptop.color != null ? laptop.color : [];
    this.create_type = value;

    this.formCreateProduct.patchValue({
      name: laptop.name,
      series: laptop.series,
      CPU_name: laptop.CPU.name,
      CPU_speed: laptop.CPU.speed,
      CPU_cache: laptop.CPU.cache,
      RAM_capacity: laptop.RAM.capacity,
      RAM_socket_number: laptop.RAM.socket_number,
      storage: laptop.storage,
      display: laptop.display,
      // display: this.getCoreName.transform(laptop.display, 'display'),
      graphic: laptop.graphic,
      wireless: laptop.wireless,
      LAN: laptop.LAN,
      connection_USB: laptop.connection.USB,
      connection_HDMI_VGA: laptop.connection.HDMI_VGA,
      keyboard: laptop.keyboard,
      webcam: laptop.webcam,
      audio: laptop.audio,
      battery: laptop.battery,
      OS: laptop.OS,
      dimension: laptop.dimension,
      weight: laptop.weight,
      security: laptop.security,
      price: laptop.price,
      sale: laptop.sale,
      filter: {
        vga: laptop.filter.vga,
        need: laptop.filter.need,
        cpu: laptop.filter.cpu,
        ram: laptop.filter.ram,
        storage: laptop.filter.storage,
        screen_size: laptop.filter.screen_size,
        screen_resolution: laptop.filter.screen_resolution,
        os: laptop.filter.os,
        price_range: laptop.filter.price_range,
      },
    });
    this.edit_product_id = laptop.laptop_id;
    this.drawer_state = "Edit";
    this.currentLaptopThumbnail = null;
    this.visible = true;
  }
  // close edit product
  close_edit_product() {
    this.drawer_state = null;
    this.visible = false;
  }
  // delete product
  delete(value) {
    this.laptopService.delete_item_by_id(value).subscribe((res) => {
      this.ngOnInit();
    });
  }
  // submit product
  onSubmit() {
    const formSubmit = new FormData();
    const formThumbnail = new FormData();
    formSubmit.append(
      "laptop_id",
      "l_" + this.convert.urlConvert(this.formCreateProduct.value.name)
    );
    formSubmit.append("brand", "HP");
    formSubmit.append("name", this.formCreateProduct.value.name);
    formSubmit.append("series", this.formCreateProduct.value.series);
    formSubmit.append("CPU_name", this.formCreateProduct.value.CPU_name);
    formSubmit.append("CPU_speed", this.formCreateProduct.value.CPU_speed);
    formSubmit.append("CPU_cache", this.formCreateProduct.value.CPU_cache);
    formSubmit.append(
      "RAM_capacity",
      this.formCreateProduct.value.RAM_capacity
    );
    formSubmit.append(
      "RAM_socket_number",
      this.formCreateProduct.value.RAM_socket_number
    );
    formSubmit.append("storage", this.formCreateProduct.value.storage);
    formSubmit.append("display", this.formCreateProduct.value.display);
    formSubmit.append("graphic", this.formCreateProduct.value.graphic);
    formSubmit.append("wireless", this.formCreateProduct.value.wireless);
    formSubmit.append("LAN", this.formCreateProduct.value.LAN);
    formSubmit.append(
      "connection_USB",
      this.formCreateProduct.value.connection_USB
    );
    formSubmit.append(
      "connection_HDMI_VGA",
      this.formCreateProduct.value.connection_HDMI_VGA
    );
    formSubmit.append("keyboard", this.formCreateProduct.value.keyboard);
    formSubmit.append("webcam", this.formCreateProduct.value.webcam);
    formSubmit.append("audio", this.formCreateProduct.value.audio);
    formSubmit.append("battery", this.formCreateProduct.value.battery);
    formSubmit.append("OS", this.formCreateProduct.value.OS);
    formSubmit.append("dimension", this.formCreateProduct.value.dimension);
    formSubmit.append("weight", this.formCreateProduct.value.weight);
    this.productColor.map((item) => formSubmit.append("color", item));
    formSubmit.append("security", this.formCreateProduct.value.security);
    formSubmit.append("price", this.formCreateProduct.value.price);
    formSubmit.append("sale", this.formCreateProduct.value.sale);

    formSubmit.append(
      "filter",
      JSON.stringify(this.formCreateProduct.value.filter)
    );

    if (this.drawer_state === "Create") {
      if (this.currentLaptopThumbnail) {
        formSubmit.append("prefix", "thumbnails");
        formSubmit.append("product_type", "laptop");
        for (let i = 0; i < this.currentLaptopThumbnail.length; i++) {
          formSubmit.append("laptop", this.currentLaptopThumbnail[i]);
        }
        this.laptopService.push_laptop_data(formSubmit).subscribe((res) => {
          this.visible = false;
          this.ngOnInit();
        });
      } else {
        this.visible_thumbnail = false;
      }
    } else if (this.drawer_state == "Edit") {
      formSubmit.append("edit_product_id", this.edit_product_id);
      this.laptopService
        .edit_laptop_data(formSubmit, this.edit_product_id)
        .subscribe((res) => {
          this.ngOnInit();
          this.visible = false;
        });
    }
  }

  //detect upload thumbnail event
  fileChangeEvent(event) {
    this.currentLaptopThumbnail = <FileList>event.target.files;
    this.visible_thumbnail = true;

    for (let i = 0; i < this.currentLaptopThumbnail.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(this.currentLaptopThumbnail[i]);
      reader.onload = (_event) => {
        this.imgURL.push(reader.result);
      };
    }
    // this.thumbnails.concat(this.imgURL);
  }
  // change status
  change_item_status(id, status) {
    this.laptopService.change_item_status(id, !status).subscribe((res) => {
      this.laptops = this.laptops.map((lap) =>
        lap.laptop_id === id ? { ...lap, status: !status } : lap
      );
    });
  }

  onCheckChange(event) {
    if (event.target.checked) {
      this.productColor.push(event.target.value);
    } else {
      this.productColor = this.productColor.filter(
        (item) => item != event.target.value
      );
    }
  }

  showThumbnail(thumbnails, laptop_id, laptop) {
    this.thumbnails = [];
    this.listToDelete = [];
    this.imgURL = [];
    this.currentLaptopThumbnail = null;
    // this.showThumbnails.push(laptop.laptop_id, laptop.name, laptop.series);
    // this.showThumbnails = this.showThumbnails.concat(thumbnail);
    this.showLaptop = laptop;
    this.thumbnails = thumbnails;
    this.laptop_id = laptop_id;
  }

  addMoreThumbnail(laptop) {
    const formThumbnail = new FormData();
    if (this.currentLaptopThumbnail) {
      //   let max_index_thumbnail;
      formThumbnail.append("prefix", "thumbnails");
      formThumbnail.append("product_type", "laptop");
      formThumbnail.append("brand", "HP");
      formThumbnail.append("series", laptop.series.toLowerCase());
      formThumbnail.append("laptop_id", laptop.laptop_id);
      //   laptop.thumbnail.map((thumbnail) => {
      //     formThumbnail.append(
      //       "thumbnails",
      //       thumbnail.slice(
      //         thumbnail.lastIndexOf("-") + 1,
      //         thumbnail.lastIndexOf(".")
      //       )
      //     );
      //     max_index_thumbnail = Number(
      //       thumbnail.slice(
      //         thumbnail.lastIndexOf("-") + 1,
      //         thumbnail.lastIndexOf(".")
      //       )
      //     );
      //   });
      //   formThumbnail.append("max_index_thumbnail", max_index_thumbnail);
      for (let i = 0; i < this.currentLaptopThumbnail.length; i++) {
        formThumbnail.append("laptop", this.currentLaptopThumbnail[i]);
        // formThumbnail.append(
        //   "thumbnails",
        //   (i + 1 + max_index_thumbnail).toString()
        // );
      }
    }
    this.laptopService
      .update_laptop_thumbnails(formThumbnail)
      .subscribe((res) => this.ngOnInit());
    // }
  }

  pick_image_to_delete(thumbnail) {
    if (!this.listToDelete.includes(thumbnail) && this.thumbnails.length >= 4) {
      this.listToDelete.push(thumbnail);
    } else {
      this.listToDelete = this.listToDelete.filter((item) => item != thumbnail);
    }
  }

  delete_laptop_thumbnail() {
    this.laptopService
      .delete_laptop_thumbnail(this.listToDelete, this.laptop_id)
      .subscribe((res) => {
        this.ngOnInit();
      });
  }

  onEditBlog(laptop_id: string) {
    this.router.navigate(['/admin/items', laptop_id])
  }
}