import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

let Thrift = require('thrift');
let ccDbService = require('api/codeCheckerDBAccess');
let reportServerTypes = require('api/report_server_types');

@Injectable()
export class DbService implements OnDestroy {
  private sub: any;
  private client: any;

  constructor(private route: ActivatedRoute) {
    var that = this;

    this.sub = this.route.parent.params.subscribe(params => {
      let transport = Thrift.TBufferedTransport;
      let protocol = Thrift.TJSONProtocol;
      let connection = Thrift.createXHRConnection(
      SERVER_HOST, SERVER_PORT, {
        transport: transport,
        protocol: protocol,
        path: '/' + params['product'] +
              '/v' + API_VERSION + '/CodeCheckerService'
      });
      that.client = Thrift.createXHRClient(ccDbService, connection);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public getPackageVerison(cb: (err: string, version: string) => void) {
    this.client.getPackageVersion(cb);
  }

  public getRunData(runFilter: any, cb: (err: string, runs : any[]) => void) {
    this.client.getRunData(runFilter, cb);
  }

  public getSourceFileData(
    fileId: number,
    fileContent: boolean,
    encoding: any,
    cb: (err: string, sourceFile : any) => void
  ) {
    this.client.getSourceFileData(fileId, fileContent, encoding, cb);
  }

  public getRunResults(cb: (err: string, reports: any[]) => void) {
    var reportFilter = new reportServerTypes.ReportFilter();

    var res = this.client.getRunResults(
      null,
      5, /*ccDbService.MAX_QUERY_SIZE,*/
      0,
      null,
      null,
      null,
      cb);
  }

  public getReportDetails(
    reportId: number,
    cb: (err: string, reportDetails: any[]) => void
  ) {
    this.client.getReportDetails(reportId, cb);
  }
}