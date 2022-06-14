import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestrictService } from '../shared/guards/restrict.service';
import { SupAdGuard } from '../shared/guards/sup-ad.guard';
import { UserResolver } from '../shared/guards/user.resolver';
import { AdminComponent } from './admin.component';
import { ChatComponent } from './chat/chat.component';
import { ItemsComponent } from './items/items.component';
import { OrderComponent } from './order/order.component';
import { CoverageComponent } from './coverage/coverage.component';
import { OverviewComponent } from './overview/overview.component';
import { BlogComponent } from './items/blog/blog.component';
import { SkuComponent } from './sku/sku.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    resolve: { user: UserResolver },
    canActivate: [SupAdGuard],
    children: [
      {
        path: 'items',
        component: ItemsComponent,
        resolve: { user: UserResolver }
      },
      {
        path: 'items/:id',
        component: BlogComponent,
      },
      {
        path:'chat',
        component: ChatComponent
      },
      {
        path: 'orders',
        component: OrderComponent
      },
      {
        path: 'coverage',
        component: CoverageComponent
      },
      {
        path: 'overview',
        component: OverviewComponent
      },
      {
        path: 'chatting',
        component: ChatComponent
      },
      {
        path: 'specifications',
        component: SkuComponent
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
