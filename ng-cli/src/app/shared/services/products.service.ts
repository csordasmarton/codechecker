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
    SERVER_HOST, SERVER_PORT, {
      transport: transport,
      protocol: protocol,
      path: '/v' + API_VERSION + '/Products'
    });

    this.client = Thrift.createXHRClient(ccProductService, connection);
  }

  public getClient() {
    return this.client;
  }
}