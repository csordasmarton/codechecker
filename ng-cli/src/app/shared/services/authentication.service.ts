import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const ccAuthService = require('api/codeCheckerAuthentication');

import { BaseService } from './base.service';
import { TokenService } from '.';
import { RequestFailed } from '..';

@Injectable()
export class AuthenticationService extends BaseService {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, ccAuthService, 'Authentication');
  }

  public performLogin(
    authMethod: string,
    authString: string,
    cb: (err: RequestFailed, token: string) => void
  ) {
    this.client.performLogin(authMethod, authString, cb);
  }

  public getTokens(cb: (err: RequestFailed, tokens: string[]) => void) {
    this.client.getTokens(this.cbErrWrapper(cb));
  }

  public getAuthParameters(cb: (err: RequestFailed, ret: any) => void) {
    this.client.getAuthParameters(this.cbErrWrapper(cb));
  }

  getPermissionsForUser(
    scope: string,
    extraParams: string,
    permissionFilter: any,
    cb: (err: RequestFailed, permissions: [any]) => void
  ) {
    this.client.getPermissionsForUser(scope, extraParams, permissionFilter,
      this.cbErrWrapper(cb));
  }

  getAuthorisedNames(
    permission: any,
    extraParams: string,
    cb: (err: RequestFailed, authorizations: any) => void
  ) {
    this.client.getAuthorisedNames(permission, extraParams,
      this.cbErrWrapper(cb));
  }
}
