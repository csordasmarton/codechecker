import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

let Thrift = require('thrift');
let ccDbService = require('api/codeCheckerDBAccess');
let reportServerTypes = require('api/report_server_types');

import { BaseService } from './base.service';
import { TokenService } from '.';

@Injectable()
export class DbService extends BaseService {
  private sub: any;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, ccDbService, "CodeCheckerService");
  }

  public getPackageVerison(cb: (err: string, version: string) => void) {
    this.client.getPackageVersion(cb);
  }

  public getRunData(runFilter: any, cb: (err: string, runs : any[]) => void) {
    this.client.getRunData(runFilter, cb);
  }

  getRunIds(runNames : [string]) : Promise<number[]> {
    return new Promise((resolve, reject) => {
      if (!runNames) {
        return resolve(null);
      }

      if (!(runNames instanceof Array))
        runNames = [runNames];

      let runFilter = new reportServerTypes.RunFilter();
      runFilter.names = runNames;

      this.getRunData(runFilter, (err, runs) => {
        resolve(runs.map((run) => {
          return run.runId;
        }));
      });
    });
  }

  public getSourceFileData(
    fileId: number,
    fileContent: boolean,
    encoding: any,
    cb: (err: string, sourceFile : any) => void
  ) {
    this.client.getSourceFileData(fileId, fileContent, encoding,
      this.cbErrWrapper(cb));
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
      cmpData, this.cbErrWrapper(cb));
  }

  getReport(
    reportId: number,
    cb: (err: string, reportData: any) => void
  ) {
    this.client.getReport(reportId, this.cbErrWrapper(cb));
  }

  public getReportDetails(
    reportId: number,
    cb: (err: string, reportDetails: any[]) => void
  ) {
    this.client.getReportDetails(reportId, this.cbErrWrapper(cb));
  }

  public getSeverityCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, severityMap: any) => void
  ){
    this.client.getSeverityCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getDetectionStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, detectionStatusMap: any) => void
  ){
    this.client.getDetectionStatusCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getReviewStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reviewStatusMap: any) => void
  ){
    this.client.getReviewStatusCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
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
      offset, this.cbErrWrapper(cb));
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
      offset, this.cbErrWrapper(cb));
  }

  public getFileCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: string, fileMap: any) => void
  ){
    this.client.getFileCounts(runIds, reportFilter, cmpData, limit, offset,
      this.cbErrWrapper(cb));
  }

  public getRunResultCount(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunResultCount(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getRunReportCounts(
    runIds: number[],
    reportFilter: any,
    limit: number,
    offset: number,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunReportCounts(runIds, reportFilter, limit, offset,
      this.cbErrWrapper(cb));
  }

  public getRunHistoryTagCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: string, reportCount: any) => void
  ){
    this.client.getRunHistoryTagCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }
}