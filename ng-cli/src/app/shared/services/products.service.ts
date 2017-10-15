import { Injectable } from '@angular/core';

let Thrift = require('thrift');
let ccProductService = require('api/codeCheckerProductService');

@Injectable()
export class ProductService {
  private client : any;

  constructor() {
    let transport = Thrift.TBufferedTransport;
    let protocol = Thrift.TJSONProtocol;
    let connection = Thrift.createXHRConnection(
    'localhost', 8001, {
      transport: transport,
      protocol: protocol,
      path: '/Default/v' + '6.1' + '/Products' // TODO: read from config
    });

    this.client = Thrift.createXHRClient(ccProductService, connection);
  }

  public getClient() {
    return this.client;
  }
}