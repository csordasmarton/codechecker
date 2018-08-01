import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { codeCheckerAuthentication } from '@cc/authentication';

import { TokenService } from '.';
import { BaseService } from './base.service';

@Injectable()
export class AuthenticationService extends BaseService<codeCheckerAuthentication.Client> {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, codeCheckerAuthentication.Client,
      'Authentication');
  }
}
