import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, BaseChartDirective, Label } from "ng2-charts";

@Component({
  selector: "app-user-session",
  templateUrl: "./user-session.component.html",
  styleUrls: ["./user-session.component.css"],
})
export class UserSessionComponent implements OnInit {
  type = "line";
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ người số lượng người dùng theo phiên",
      },
    },
  };

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  @Input() dataSet: { data: number[]; label: string }[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.lineChartData = this.dataSet;
    this.chart.update();
  }
}
