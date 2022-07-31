import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RestrictService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(
        (user) => {
          if (
            user.providerData[0].providerId == 'password' &&
            !user.emailVerified
          ) {
            AuthService.returnURI = state.url;
            this.router.navigate(['/']);
            return resolve(false);
          } else {
            return resolve(true);
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
