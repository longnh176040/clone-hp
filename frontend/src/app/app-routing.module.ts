import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CheckCoverageComponent } from './check-coverage/check-coverage.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { MessengerComponent } from './messenger/messenger.component';
import { PermissionComponent } from './permission/permission.component';
import { PoliciesComponent } from './policies/policies.component';
import { PolicyDetailComponent } from './policies/policy-detail/policy-detail.component';
import { PolicyListComponent } from './policies/policy-list/policy-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductsComponent } from './products/products.component';
import { UserResolver } from './shared/guards/user.resolver';


const routes: Routes = [

  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  { path: 'permission', component: PermissionComponent },

  {
    path: '', component: LayoutComponent, children: [
      { path: 'home', component: HomeComponent, resolve: {user: UserResolver} },
      {
        path: 'messenger', component: MessengerComponent
      },
      {
        path: 'products', component: ProductsComponent, resolve: {user: UserResolver}, children: [
          { path: '', component: ProductListComponent },
          { path: ':name/:id', component: ProductDetailComponent }
        ]
      },
      {
        path: 'checkout', component: CheckoutComponent, resolve: {user: UserResolver}
      },
      {
        path: 'policies', component: PoliciesComponent, children: [
          { path: '', component: PolicyListComponent },
          { path: ':title', component: PolicyDetailComponent },
        ]
      },
      { path: 'check-coverage', component: CheckCoverageComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'authentication', resolve: {user: UserResolver}, component: AuthenticationComponent },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      // enableTracing: true,
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
