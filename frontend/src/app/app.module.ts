import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  BrowserModule,
  BrowserTransferStateModule,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "src/environments/environment";
import { AdminModule } from "./admin/admin.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from "./layout/header/header.component";
import { LayoutComponent } from "./layout/layout.component";
import { PermissionComponent } from "./permission/permission.component";
import { ProductDetailComponent } from "./products/product-detail/product-detail.component";
import { ProductListComponent } from "./products/product-list/product-list.component";
import { ProductsComponent } from "./products/products.component";
import { RestrictService } from "./shared/guards/restrict.service";
import { SupAdGuard } from "./shared/guards/sup-ad.guard";
import { UserResolver } from "./shared/guards/user.resolver";
import { PipeModule } from "./shared/pipe/pipe.module";
import { AuthService } from "./shared/services/auth.service";
import { LaptopService } from "./shared/services/laptop.service";


// angular material modules

import { CommentsComponent } from './products/product-detail/comments/comments.component';
import { PoliciesComponent } from './policies/policies.component';
import { PolicyDetailComponent } from './policies/policy-detail/policy-detail.component';
import { CheckCoverageComponent } from './check-coverage/check-coverage.component';
import { PolicyListComponent } from './policies/policy-list/policy-list.component';
import { MessengerComponent } from './messenger/messenger.component';
import { StarComponent } from './products/product-detail/star/star.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';


// Alogila search

import { NgAisModule } from 'angular-instantsearch';
import { UserInfoComponent } from './checkout/user-info/user-info.component';
import { BannerComponent } from './shared/components/banner/banner.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { ContactComponent } from './contact/contact.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { CategoryComponent } from './shared/components/category/category.component';
import { SliderComponent } from './shared/components/slider/slider.component';
import { SortComponent } from './products/product-list/sort/sort.component';

// Socket.io


@NgModule({
  declarations: [
    AppComponent,
    PermissionComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ProductsComponent,
    ProductListComponent,
    ProductDetailComponent,
    AuthenticationComponent,
    CheckoutComponent,
    HomeComponent,
    CommentsComponent,
    PoliciesComponent,
    PolicyDetailComponent,
    CheckCoverageComponent,
    PolicyListComponent,
    MessengerComponent,
    StarComponent,
    UserInfoComponent,
    BannerComponent,
    ProductCardComponent,
    ContactComponent,
    RecruitmentComponent,
    CategoryComponent,
    SliderComponent,
    SortComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AdminModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    MatTabsModule,
    NgAisModule.forRoot(),
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    LaptopService,
    RestrictService,
    SupAdGuard,
    UserResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
