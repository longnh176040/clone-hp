import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "./shared/services/auth.service";
import { ChatService } from "./shared/services/chat.service";

declare const gtag;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "frontend";
  constructor(private authService: AuthService, private chatService: ChatService, private router: Router) {
    this.authService.resolveUser();
    this.chatService.initSocket()
  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('set', 'page', event.urlAfterRedirects);
        gtag('send', 'pageview');
      }
    });
  }
}
