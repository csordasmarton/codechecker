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

  public getRunResults(
    runIds: number[],
    limit: number,
    offset: number,
    sortType: any[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reports: any[]) => void
  ) {
    this.client.getRunResults(runIds, limit, offset, sortType, reportFilter,
      cmpData, cb);
  }

  public getReportDetails(
    reportId: number,
    cb: (err: string, reportDetails: any[]) => void
  ) {
    this.client.getReportDetails(reportId, cb);
  }

  public getSeverityCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, severityMap: any) => void
  ){
    this.client.getSeverityCounts(runIds, reportFilter, cmpData, cb);
  }

  public getDetectionStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, detectionStatusMap: any) => void
  ){
    this.client.getDetectionStatusCounts(runIds, reportFilter, cmpData, cb);
  }

  public getReviewStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reviewStatusMap: any) => void
  ){
    this.client.getReviewStatusCounts(runIds, reportFilter, cmpData, cb);
  }

  public getCheckerMsgCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: string, fileMap: any) => void
  ){
    this.client.getCheckerMsgCounts(runIds, reportFilter, cmpData, limit,
      offset, cb);
  }

  public getCheckerCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: string, fileMap: any) => void
  ){
    this.client.getCheckerCounts(runIds, reportFilter, cmpData, limit,
      offset, cb);
  }

  public getFileCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: string, fileMap: any) => void
  ){
    this.client.getFileCounts(runIds, reportFilter, cmpData, limit, offset, cb);
  }

  public getRunResultCount(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunResultCount(runIds, reportFilter, cmpData, cb);
  }

  public getRunReportCounts(
    runIds: number[],
    reportFilter: any,
    limit: number,
    offset: number,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunReportCounts(runIds, reportFilter, limit, offset, cb);
  }

  public getRunHistoryTagCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunHistoryTagCounts(runIds, reportFilter, cmpData, cb);
  }
}