import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OrderService } from "src/app/shared/services/order.service";
import { Observable, Subject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

@Component({
  selector: "app-check-coverage",
  templateUrl: "./check-coverage.component.html",
  styleUrls: ["./check-coverage.component.css"],
})
export class CheckCoverageComponent implements OnInit {
  coverageId: string = "";
  coverageForm: FormGroup = new FormGroup({});
  coverage: any;

  coverageOderCreated: string = "";
  coverageCreatTime: string = "";
  coveragePhone: string = "";
  coverageStatus: string = "";

  oneYearLater: any;
  coverageTime: string = "";
  recentTime: any;
  coverageTimeCheck: boolean = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.coverageForm = new FormGroup({
      coverageId: new FormControl(),
      coveragePhone: new FormControl(),
    });
  }
  save() {}
  coverageId_submit() {
    this.coverageId = this.coverageForm.get("coverageId").value;
    this.orderService
      .getOrdersById(this.coverageId)
      .pipe(
        tap(_ => this.coverage = null),
        filter((res) => res != undefined),
        map((res: any) => {
          const createdOrderDate = new Date(res.created_time_stamp);
          return {
            ...res,
            createdOrderDate,
          };
        })
      )
      .subscribe((res) => {
        this.coverage = res;
        this.oneYearLater = res.createdOrderDate;
        this.oneYearLater.setFullYear(this.oneYearLater.getFullYear() + 1);
        this.recentTime = new Date();
        if (this.recentTime < this.oneYearLater) {
          this.coverageTimeCheck = true;
        }
        this.oneYearLater = this.timeConvert(this.oneYearLater)
      });
  }
  coveragePhone_submit(){
    this.coveragePhone = this.coverageForm.get("coveragePhone").value;
    this.orderService
      .getCoverageStatusByPhone(this.coveragePhone)
      .pipe(
        tap(_ => this.coverage = null),
        filter((res) => res != undefined),)

      .subscribe((res) => {
        this.coverage = res;
      });
  }


  private timeConvert(now: Date) {
    let hours = now.getHours().toString();
    let minutes = now.getMinutes().toString();
    let month = (now.getMonth() + 1).toString();
    let date = now.getDate().toString();
    if (Number(hours) < 10) {
      hours = "0" + hours;
    }
    if (Number(minutes) < 10) {
      minutes = "0" + minutes;
    }
    if (Number(month) < 10) {
      month = "0" + month;
    }
    if (Number(date) < 10) {
      date = "0" + date;
    }
    const time = hours + ":" + minutes;
    const fullDate = date + "/" + month + "/" + now.getFullYear();
    return time + " - " + fullDate;
  }
}
