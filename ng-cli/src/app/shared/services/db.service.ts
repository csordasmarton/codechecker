import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

let Thrift = require('thrift');
let ccDbService = require('api/codeCheckerDBAccess');
let reportServerTypes = require('api/report_server_types');

@Injectable()
export class DbService {
  private client : any;

  constructor(private route: ActivatedRoute) {
    var that = this;

    route.params.subscribe(function (params) {
      let transport = Thrift.TBufferedTransport;
      let protocol = Thrift.TJSONProtocol;
      let connection = Thrift.createXHRConnection(
      'localhost', 8001, {
        transport: transport,
        protocol: protocol,
        path: '/' + params['product'] + '/v6.1/CodeCheckerService' // TODO: read from config
      });
      that.client = Thrift.createXHRClient(ccDbService, connection);
    });
  }

  public getPackageVerison(cb: (err: string, version: string) => void) {
    this.client.getPackageVersion(cb);
  }

  public getRunData(runFilter: any, cb: (err: string, runs : any[]) => void) {
    this.client.getRunData(runFilter, cb);
  }

  public getRunResults(cb: (err: string, reports: any[]) => void) {
    var reportFilter = new reportServerTypes.ReportFilter();

    var res = this.client.getRunResults(
      null,
      ccDbService.MAX_QUERY_SIZE,
      0,
      null,
      null,
      null,
      cb);
  }
}