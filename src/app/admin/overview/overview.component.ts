import { Component, OnInit } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { GoogleAnalyticsService } from "src/app/shared/services/google-analytics.service";
import * as _collection from "lodash/collection";
import * as moment from "moment";
import { environment } from "src/environments/environment";

declare const gapi;

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  access_token: string;

  userSessionData: any = [];

  locationLabels: string[] = [];
  locationData: number[] = [];

  totalItemQuantity_thisWeek: number;
  totalTransactionValue_thisWeek: number;

  totalItemQuantity_lastWeek: number;
  totalTransactionValue_lastWeek: number;

  differentTransaction: number;

  thisWeekOrders: any = [];

  private readonly VIEW_ID = environment.viewID;

  constructor(private _gaService: GoogleAnalyticsService) {}

  ngOnInit(): void {
    this._gaService.getGoogleAnalyticsAPIAccessToken().subscribe((res) => {
      this.access_token = res.access_token;
      this.getAnalyticsData(this.access_token);
    });
  }

  private getAnalyticsData(access_token: string) {
    var now = moment();

    gapi.analytics.ready(() => {
      gapi.analytics.auth.authorize({
        serverAuth: {
          access_token: access_token,
        },
      });

      var thisWeekUserSession = query({
        ids: this.VIEW_ID,
        dimensions: "ga:date,ga:nthDay",
        metrics: "ga:sessions",
        "start-date": moment(now)
          .subtract(1, "day")
          .day(0)
          .format("YYYY-MM-DD"),
        "end-date": moment(now).format("YYYY-MM-DD"),
      });

      var lastWeekUserSession = query({
        ids: this.VIEW_ID,
        dimensions: "ga:date,ga:nthDay",
        metrics: "ga:sessions",
        "start-date": moment(now)
          .subtract(1, "day")
          .day(0)
          .subtract(1, "week")
          .format("YYYY-MM-DD"),
        "end-date": moment(now)
          .subtract(1, "day")
          .day(6)
          .subtract(1, "week")
          .format("YYYY-MM-DD"),
      });

      forkJoin({
        thisWeek: thisWeekUserSession,
        lastWeek: lastWeekUserSession,
      })
        .pipe(
          map((data: any) => {
            var thisWeek = [...data.thisWeek.rows];
            var lastWeek = [...data.lastWeek.rows];
            var thisWeekData: number[] = [];
            var lastWeekData: number[] = [];

            lastWeek.forEach((row, index) => {
              lastWeekData.push(+row[2]);
              if (thisWeek[index]) {
                thisWeekData.push(+thisWeek[index][2]);
              } else {
                thisWeekData.push(0);
              }
            });

            return [
              { data: thisWeekData, label: "Tuần này" },
              { data: lastWeekData, label: "Tuần trước" },
            ];
          })
        )
        .subscribe((sessions) => {
          this.userSessionData = sessions;
        });

      var cities = query({
        ids: this.VIEW_ID,
        dimensions: "ga:city",
        metrics: "ga:sessions",
        "start-date": "30daysAgo",
        "end-date": "today",
      });

      cities
        .pipe(
          map((res: any) => {
            var vals = res.rows;
            vals.forEach((row: any) => {
              this.locationLabels.push(row[0]);
              this.locationData.push(+row[1]);
            });
          })
        )
        .subscribe();

      var thisWeekTransaction = query({
        ids: this.VIEW_ID,
        dimensions: "ga:transactionId",
        metrics: "ga:totalValue,ga:itemQuantity",
        "start-date": moment(now)
          .subtract(1, "day")
          .day(0)
          .format("YYYY-MM-DD"),
        "end-date": moment(now).format("YYYY-MM-DD"),
      });

      var lastWeekTransaction = query({
        ids: this.VIEW_ID,
        dimensions: "ga:transactionId",
        metrics: "ga:totalValue,ga:itemQuantity",
        "start-date": moment(now)
          .subtract(1, "day")
          .day(0)
          .subtract(1, "week")
          .format("YYYY-MM-DD"),
        "end-date": moment(now)
          .subtract(1, "day")
          .day(6)
          .subtract(1, "week")
          .format("YYYY-MM-DD"),
      });

      forkJoin({ thisWeek: thisWeekTransaction, lastWeek: lastWeekTransaction })
        .pipe(
          map((data: any) => {
            var thisWeek = [...data.thisWeek.rows];
            var thisWeekOrders = [];

            this.totalTransactionValue_thisWeek =
              +data.thisWeek.totalsForAllResults["ga:totalValue"];
            this.totalItemQuantity_thisWeek =
              +data.thisWeek.totalsForAllResults["ga:itemQuantity"];

            this.totalTransactionValue_lastWeek =
              +data.lastWeek.totalsForAllResults["ga:totalValue"];
            this.totalItemQuantity_lastWeek =
              +data.lastWeek.totalsForAllResults["ga:itemQuantity"];

            this.differentTransaction = this.totalTransactionValue_thisWeek
              - this.totalTransactionValue_lastWeek;

            thisWeek.forEach((row: any) => {
              thisWeekOrders.push({
                orderId: row[0],
                totalValue: +row[1],
                quantity: +row[2],
              });
            });

            return thisWeekOrders;
          })
        )
        .subscribe((orders) => {
          this.thisWeekOrders = orders;
        });

      function query(params) {
        return new Observable((subscriber) => {
          var data = new gapi.analytics.report.Data({ query: params });
          data
            .once("success", function (response) {
              subscriber.next(response);
              subscriber.complete();
            })
            .once("error", function (response) {
              subscriber.error(response);
            })
            .execute();
        });
      }
    });
  }
}
