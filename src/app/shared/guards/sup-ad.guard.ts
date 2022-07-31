import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupAdGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        this.authService.resolveUser().then(
          () => {
            // console.log(AuthService.user)
            if (AuthService.user.role === 'admin') {
              return resolve(true);
            } else {
              this.router.navigate(['/permission']);
              return resolve(false);
            }
          },
          (err) => {
            AuthService.returnURI = state.url;
            this.router.navigate(['/']);
            return resolve(false);
          }
        );
      });
  }

}