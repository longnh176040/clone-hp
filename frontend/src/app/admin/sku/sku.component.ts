import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Laptop } from "src/app/shared/models/laptop.model";
import { GetCoreNamePipe } from "src/app/shared/pipe/get-core-name.pipe";
import { SkuService } from "src/app/shared/services/sku.service";

@Component({
  selector: "app-sku",
  templateUrl: "./sku.component.html",
  styleUrls: ["./sku.component.css"],
})
export class SkuComponent implements OnInit {
  showThumbnails: string[] = [];
  public thumbnails: string[] = [];
  public laptop_id: string;

  showLaptop: Laptop;
  search_by_name = new FormControl("");
  edit_product_id;
  drawer_state;
  specfics: Laptop[];
  visible = false;
  formCreateProduct: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    value: new FormControl(null, [Validators.required]),
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
    private SkuService: SkuService,
    private getCoreName: GetCoreNamePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.SkuService.get_sku().subscribe((res) => {
      this.specfics = res;
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
        this.specfics = filterLaptop;
      });
    });
  }

  sortByName() {
    this.specfics.sort((a, b) => {
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
    this.specfics.sort((a, b) => {
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
  // open create product
  open_create_product(value) {
    this.formCreateProduct.reset();
    this.drawer_state = "Create";
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
    this.create_type = value;
    this.formCreateProduct.patchValue({
      name: laptop.name,
      value: laptop.value,
    });
    this.edit_product_id = laptop.laptop_id;
    this.drawer_state = "Edit";
    this.visible = true;
  }
  // close edit product
  close_edit_product() {
    this.drawer_state = null;
    this.visible = false;
  }
  // delete product
  delete(value) {
    this.SkuService.delete_item_by_id(value).subscribe((res) => {
      this.ngOnInit();
    });
  }
  // submit product
  onSubmit() {
    if (this.drawer_state === "Create") {
      this.SkuService.push_sku_data(this.formCreateProduct.value).subscribe((res) => {
        this.visible = false;
        this.ngOnInit();
      });
    }
  }
}
