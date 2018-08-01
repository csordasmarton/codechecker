import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { codeCheckerProductService } from '@cc/product-management';

import { TokenService } from '.';
import { BaseService } from './base.service';

@Injectable()
export class ProductService extends BaseService<codeCheckerProductService.Client> {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, codeCheckerProductService.Client,
      'Products');
  }
}
