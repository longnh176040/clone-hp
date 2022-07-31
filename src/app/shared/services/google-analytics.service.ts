import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly ANALYTICS_URL = environment.apiURL + '/analytics';

  constructor(private httpClient: HttpClient) {}

  public getGoogleAnalyticsAPIAccessToken() {
    return this.httpClient.get<{ access_token: string }>(
      this.ANALYTICS_URL + '/auth'
    );
  }

  public ecommerceEvent(eventName: string, data: any) {
    gtag('event', eventName, data);
  }

  public eventEmitter(
    event_cat: string,
    event_action: string,
    event_label: string,
    event_value?: number
  ) {
    gtag('event', event_action, {
      event_category: event_cat,
      event_label: event_label,
      value: event_value
    });
  }
}
