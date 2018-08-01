import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { HandshakeInformation } from '@cc/authentication';

import { AuthenticationService, TokenService } from '../shared';

@Injectable()
export class AuthGuard implements CanActivate {

  private authParameters: Promise<HandshakeInformation>;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authenticationService: AuthenticationService
  ) {
    this.authParameters =
      this.authenticationService.getClient().getAuthParameters();
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
