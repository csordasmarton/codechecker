import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

let ccAuthService = require('api/codeCheckerAuthentication');

import { BaseService } from './base.service';
import { TokenService } from '.';

@Injectable()
export class AuthenticationService extends BaseService {
 
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, ccAuthService, "Authentication");
  }

  public performLogin(
    authMethod: string,
    authString: string,
    cb: (err: string, token : string) => void
  ) {
    this.client.performLogin(authMethod, authString, cb);
  }

  public getTokens(cb: (err: string, tokens : string[]) => void) {
    this.client.getTokens(this.cbErrWrapper(cb));
  }

  public getAuthParameters(cb: (err: string, ret: any) => void) {
    this.client.getAuthParameters(this.cbErrWrapper(cb));
  }
}