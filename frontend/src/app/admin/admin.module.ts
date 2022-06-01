import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConvertPricePipe } from "../shared/pipe/convert-price.pipe";
import { GetCoreNamePipe } from "../shared/pipe/get-core-name.pipe";
import { PipeModule } from "../shared/pipe/pipe.module";
import { SpaceToUnderscorePipe } from "../shared/pipe/space-to-underscore.pipe";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { ItemsComponent } from "./items/items.component";
import { ChatComponent } from "./chat/chat.component";
import { OrderComponent } from "./order/order.component";
import { CoverageComponent } from "./coverage/coverage.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { OverviewComponent } from "./overview/overview.component";
import { UserSessionComponent } from "./overview/user-session/user-session.component";
import { ChartsModule } from "ng2-charts";
import { LocationComponent } from "./overview/location/location.component";
import { OrdersComponent } from "./overview/orders/orders.component";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { AdminHeaderComponent } from '../shared/components/admin-header/admin-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { BlogComponent } from './items/blog/blog.component';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    AdminComponent,
    ItemsComponent,
    ChatComponent,
    OrderComponent,
    SidenavComponent,
    OverviewComponent,
    UserSessionComponent,
    LocationComponent,
    OrdersComponent,
    CoverageComponent,
    AdminHeaderComponent,
    BlogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ChartsModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  providers: [SpaceToUnderscorePipe, GetCoreNamePipe, ConvertPricePipe],
})
export class AdminModule {}
