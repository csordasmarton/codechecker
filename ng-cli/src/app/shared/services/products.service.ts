import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

let Thrift = require('thrift');
let ccProductService = require('api/codeCheckerProductService');

import { BaseService } from './base.service';
import { TokenService } from '.';

@Injectable()
export class ProductService extends BaseService {

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, ccProductService, "Products");
  }

  public getProducts(
    productEndpointFilter: string,
    productNameFilter: string,
    cb: (err: string, products : any[]) => void
  ) {
    this.client.getProducts(productEndpointFilter, productNameFilter,
      this.cbErrWrapper(cb));
  }

  getProductConfiguration(
    productId: number,
    cb: (err: string, config : any) => void
  ) {
    this.client.getProductConfiguration(productId, this.cbErrWrapper(cb));
  }

  public getCurrentProduct(
    cb: (err: string, product : any) => void
  ) {
    this.client.getCurrentProduct(this.cbErrWrapper(cb));
  }
}