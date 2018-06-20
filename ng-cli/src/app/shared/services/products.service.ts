import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

let Thrift = require('thrift');
let ccProductService = require('api/codeCheckerProductService');

@Injectable()
export class ProductService {
  private client : any;

  constructor(private route: ActivatedRoute, private router: Router) {
    let endpoint =
      router.routerState.snapshot.root.children[0].params['product'];

    console.log(endpoint);
    let transport = Thrift.TBufferedTransport;
    let protocol = Thrift.TJSONProtocol;
    let connection = Thrift.createXHRConnection(
    SERVER_HOST, SERVER_PORT, {
      transport: transport,
      protocol: protocol,
      path: (endpoint ? '/' + endpoint : '' ) + '/v' + API_VERSION + '/Products'
    });

    this.client = Thrift.createXHRClient(ccProductService, connection);
  }

  public getClient() {
    return this.client;
  }

  public getProducts(
    productEndpointFilter: string,
    productNameFilter: string,
    cb: (err: string, products : any[]) => void
  ) {
    this.client.getProducts(productEndpointFilter, productNameFilter, cb);
  }

  getProductConfiguration(
    productId: number,
    cb: (err: string, config : any) => void
  ) {
    this.client.getProductConfiguration(productId, cb);
  }

  public getCurrentProduct(
    cb: (err: string, product : any) => void
  ) {
    this.client.getCurrentProduct(cb);
  }
}