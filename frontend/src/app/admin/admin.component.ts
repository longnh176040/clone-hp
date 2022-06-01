import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { LaptopService } from "../shared/services/laptop.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  email = new FormControl("");
  pass = new FormControl("");
  current_laptop_thumbnail: File = null;
  sideBarOpen = true;

  constructor(
    private auth_service: AuthService,
    private laptop_service: LaptopService
  ) {}

  ngOnInit(): void {}

  register() {
    let value = {
      email: this.email.value,
      password: this.pass.value,
    };
    this.auth_service.register(value);
  }

  fileChangeEvent(event) {
    this.current_laptop_thumbnail = <File>event.target.files[0];
  }

  sideBarToggler(event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  submit() {
    const form_thumbnail = new FormData();
    form_thumbnail.append("laptop_thumbnail", this.current_laptop_thumbnail);
    this.laptop_service
      .push_laptop_thumbnail(form_thumbnail)
      .subscribe((res) => {});
  }
}
