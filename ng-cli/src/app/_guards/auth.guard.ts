import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { TokenService, AuthenticationService } from '../shared';

@Injectable()
export class AuthGuard implements CanActivate {

  private authParameters: Promise<any>;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authenticationService: AuthenticationService
  ) {
    this.authParameters = new Promise((resolve, reject) => {
      this.authenticationService.getAuthParameters((err, ret) => {
        resolve(ret);
      });
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return new Promise<boolean>((resolve, reject) => {
      this.authParameters.then((ret) => {
        if (!ret.requiresAuthentication) {
          return resolve(true);
        }

        if (this.tokenService.hasToken()) {
          return resolve(true);
        }

        // Not logged in so redirect to login page with the return url.
        this.router.navigate(['/login'], { queryParams: {
          returnUrl: state.url === '/' ? null : state.url
        }});

        resolve(false);
      });
    });
  }
}
