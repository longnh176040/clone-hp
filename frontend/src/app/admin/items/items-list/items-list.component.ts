import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Product } from "src/app/shared/models/product.model";
import { GetCoreNamePipe } from "src/app/shared/pipe/get-core-name.pipe";
import { SpaceToUnderscorePipe } from "src/app/shared/pipe/space-to-underscore.pipe";
import { LaptopService } from "src/app/shared/services/laptop.service";
import { Converter } from "src/app/shared/utils/util.convert";
import { environment } from "src/environments/environment";
import * as _collection from "lodash/collection";
import { from, iif, Observable, of, Subject } from "rxjs";
import { ProductService } from "src/app/shared/services/product.service";
import Swal from "sweetalert2";
import { finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
	selector: "app-items-list",
	templateUrl: "./items-list.component.html",
	styleUrls: ["./items-list.component.css"],
})
export class ItemsListComponent implements OnInit {
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

	public rams: string[] = ["2GB", "4GB", "8GB", "16GB", "32GB"];

	public storages: string[] = [
		"16GB",
		"32GB",
		"64GB",
		"128GB",
		"256GB",
		"512GB",
		"1TB"
	];

	public screenSize: string[] = [
		" < 4.7 inch",
		"4 inch - 5 inch",
		"5 inch - 6 inch",
		"> 6.5 inch",
	];

	public screenResolution: string[] = [
		"OLED",
		"AMOLED",
		"IPS LCD",
	];

	public oss: string[] = ["Android", "IOS", "Windows"];

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

	uploadProgressSubject = new Subject<any>()


	productColor = [];
	showLaptop: Product;
	search_by_name = new FormControl("");
	edit_product_id;
	drawer_state;
	currentLaptopThumbnail: any;
	laptops: Product[];
	visible = false;
	formCreateProduct: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required]),
		series: new FormControl(null, [Validators.required]),
		brand: new FormControl(null, [Validators.required]),
		storage: new FormControl(""),
		ram: new FormControl(""),
		screen_size: new FormControl(""),
		screen_resolution: new FormControl(""),
		price_range: new FormControl(""),
		size_range: new FormControl(""),
		chipset: new FormControl(""),
		sim: new FormControl(""),
		wifi: new FormControl(""),
		camera: new FormControl(""),
		display: new FormControl(""),
		battery: new FormControl(""),
		OS: new FormControl(""),
		price: new FormControl(null, [Validators.required]),
		sale: new FormControl(null, [Validators.required]),
		filter: new FormGroup({
			brand: new FormControl(),
			ram: new FormControl(),
			storage: new FormControl(),
			OS: new FormControl(),
			price_range: new FormControl(),
			size_range: new FormControl(),
			sim: new FormControl()
		}),
	});

	listToDelete = [];
	visible_thumbnail = true;
	create_type;
	imgURL = [];

	constructor(
		private laptopService: LaptopService,
		private productService: ProductService,
		private spaceToUnderscore: SpaceToUnderscorePipe,
		private getCoreName: GetCoreNamePipe,
		private router: Router,
		private storage: AngularFireStorage
	) {
	}

	ngOnInit(): void {
		this.productService.get_product().subscribe((res) => {
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

	// open create product
	open_create_product() {
		// this.formCreateProduct.reset();
		// this.productColor = [];
		// this.imgURL = [];
		// this.drawer_state = "Create";
		// this.currentLaptopThumbnail = null;
		// this.visible = true;
		// this.create_type = value;
		this.router.navigateByUrl('/admin/items/create-item');
	}

	// close create product
	close_create_product() {
		this.drawer_state = null;
		this.visible = false;
	}

	// open edit product
	open_edit_product(id) {
		this.router.navigate(['/admin/items/edit-item/' + id])
		// this.productColor = laptop.color != null ? laptop.color : [];
		// this.create_type = value;
		// this.formCreateProduct.patchValue({
		//   name: laptop.name,
		//   series: laptop.series,
		//   CPU_name: laptop.CPU.name,
		//   CPU_speed: laptop.CPU.speed,
		//   CPU_cache: laptop.CPU.cache,
		//   RAM_capacity: laptop.RAM.capacity,
		//   RAM_socket_number: laptop.RAM.socket_number,
		//   storage: laptop.storage,
		//   display: laptop.display,
		//   // display: this.getCoreName.transform(laptop.display, 'display'),
		//   graphic: laptop.graphic,
		//   wireless: laptop.wireless,
		//   LAN: laptop.LAN,
		//   connection_USB: laptop.connection.USB,
		//   connection_HDMI_VGA: laptop.connection.HDMI_VGA,
		//   keyboard: laptop.keyboard,
		//   webcam: laptop.webcam,
		//   audio: laptop.audio,
		//   battery: laptop.battery,
		//   OS: laptop.OS,
		//   dimension: laptop.dimension,
		//   weight: laptop.weight,
		//   security: laptop.security,
		//   price: laptop.price,
		//   sale: laptop.sale,
		//   filter: {
		//     vga: laptop.filter.vga,
		//     need: laptop.filter.need,
		//     cpu: laptop.filter.cpu,
		//     ram: laptop.filter.ram,
		//     storage: laptop.filter.storage,
		//     screen_size: laptop.filter.screen_size,
		//     screen_resolution: laptop.filter.screen_resolution,
		//     os: laptop.filter.os,
		//     price_range: laptop.filter.price_range,
		//   },
		// });
		// this.edit_product_id = laptop.laptop_id;
		// this.drawer_state = "Edit";
		// this.currentLaptopThumbnail = null;
		// this.visible = true;
	}

	// close edit product
	close_edit_product() {
		this.drawer_state = null;
		this.visible = false;
	}

	// delete product
	handleDelete(id) {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				this.productService.delete_item_by_id(id).subscribe((res) => {
					Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
					this.ngOnInit();
				});
			}
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
	fileChangeEvent( event ) {
		this.currentLaptopThumbnail = (event.target as HTMLInputElement).files;
		this.visible_thumbnail = true;
		for (let i = 0; i < this.currentLaptopThumbnail.length; i++) {
      let reader = new FileReader();
      reader.onload = ( _event ) => {
				this.imgURL.push(reader.result as string)
			};
      this.thumbnails.push(this.currentLaptopThumbnail[i]);
      reader.readAsDataURL(this.currentLaptopThumbnail[i]);
    }
	}

	// change status
	change_item_status(id, status) {
		this.productService.change_item_status(id, !status).subscribe((res) => {
			this.laptops = this.laptops.map((lap) =>
				lap._id === id ? { ...lap, status: !status } : lap
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

	showThumbnail(thumbnails, _id, laptop) {
		this.thumbnails = [];
		this.listToDelete = [];
		this.imgURL = [];
		this.currentLaptopThumbnail = null;
		this.showLaptop = laptop;
		this.thumbnails = thumbnails;
		this.laptop_id = _id
		console.log(this.thumbnails, "thumbnails")
	}
	async addMoreThumbnail( laptop ) {
    const urls = await Promise.all(this.thumbnails.map( async (item) => {
      if(typeof(item) !== 'string'){
        item = await this.getUrlFromFirebase(item);
        return item;
      }else {
        return item
      }
    }));
    if(urls.length > 5){
      return Swal.fire({
        icon: 'error',
        title: 'Không hợp lệ',
        text: 'Tối đa 5 ảnh'
      });
    }
    return this.productService.editImageUrls(urls, laptop._id).subscribe((res) => {
      Swal.fire({
        icon: "success",
        title: res.msg,
      }).then(() => this.ngOnInit());
    });
	}

	private async getUrlFromFirebase(item): Promise<string> {
		const time = Date.now();
		const filePath = `MobileImages/${time}`;
		const fileRef = this.storage.ref(filePath);
		return this.storage.upload(filePath, item).snapshotChanges().toPromise().then(() => {
			return fileRef.getDownloadURL().toPromise().then((url) => {
				return url
			});
		});
	}

	pick_image_to_delete(thumbnail, index) {
		if (!this.listToDelete.includes(thumbnail) && this.thumbnails.length >= 4) {
			this.listToDelete.push(thumbnail);
		} else {
			this.listToDelete = this.listToDelete.filter((item) => item != thumbnail);
		}
	}

	delete_laptop_thumbnail(laptop) {
		const newThumbnails = this.thumbnails.filter((item) => !this.listToDelete.includes(item));
		this.productService.editImageUrls(newThumbnails, laptop._id).subscribe((res) => {
			Swal.fire({
				icon: "success",
				title: res.msg,
			}).then(() => this.ngOnInit());
		});
	}

	onEditBlog(product_id: string) {
		this.router.navigate(['/admin/items', product_id])
	}

  onTypeOfThumbnail(type): boolean {
    if(typeof(type) === 'string') return true;
    return false
  }
}
