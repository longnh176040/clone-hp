import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from "rxjs";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {
  type: string = 'Tạo'
  visible: boolean = false;
  coverages: Observable<any> = new Observable();
  status = [
    'Chưa tiếp nhận',
    'Đã tiếp nhận',
    'Đang gửi bảo hành',
    'Đã hoàn thành bảo hành',
  ];
  addCoverageForm: FormGroup = new FormGroup({});
  editCoverageForm: FormGroup = new FormGroup({});
  coverageId: string = "";
  coverage: any;
  coverageDate: string = "";
  coveragePhone: string = "";
  coverageProduct: string = "";
  coverageReason: string = "";
  coverageStatus: string = "";
  id: string;

  submitted = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.coverages = this.orderService.getCoverage()

    this.addCoverageForm = new FormGroup({
      coverageDate: new FormControl(null, Validators.required),
      coveragePhone: new FormControl(null, Validators.required),
      coverageProduct: new FormControl(null, Validators.required),
      coverageReason: new FormControl(null, Validators.required),
      coverageStatus: new FormControl(null, Validators.required),
    });
  }

  open() {
    this.visible = true
  }

  addCoverage() {
    if (this.type === "Chỉnh sửa") {
      this.orderService.editCoverage(this.id, this.addCoverageForm.value)
        .subscribe(
          res => {
            this.editCoverageForm.reset();
            this.ngOnInit()
          }
        )
    }
    else {
      this.orderService.createCoverage(this.addCoverageForm.value)
        .subscribe(
          res => {
            this.addCoverageForm.reset();
            this.ngOnInit()
          }
        )
    }
  }
  open_edit_coverage(coverage) {
    this.id = coverage._id;
    this.type = "Chỉnh sửa"
    this.addCoverageForm.patchValue({
      coveragePhone: coverage.phone,
      coverageDate: coverage.date,
      coverageProduct: coverage.product,
      coverageReason: coverage.reason,
      coverageStatus: coverage.status,
    })
  }
  delete() { }

  onChange(value) {
  }
  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
  }
}
