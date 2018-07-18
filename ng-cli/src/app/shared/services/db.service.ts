import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const Thrift = require('thrift');
const ccDbService = require('api/codeCheckerDBAccess');
const reportServerTypes = require('api/report_server_types');

import { BaseService } from './base.service';
import { TokenService } from '.';
import { RequestFailed } from '..';

@Injectable()
export class DbService extends BaseService {
  private sub: any;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, ccDbService, 'CodeCheckerService');
  }

  public getPackageVerison(cb: (err: RequestFailed, version: string) => void) {
    this.client.getPackageVersion(cb);
  }

  public getRunData(
    runFilter: any,
    cb: (err: RequestFailed, runs: any[]) => void
  ) {
    this.client.getRunData(runFilter, cb);
  }

  getRunIds(runNames: [string]): Promise<number[]> {
    return new Promise((resolve, reject) => {
      if (!runNames) {
        return resolve(null);
      }

      if (!(runNames instanceof Array)) {
        runNames = [runNames];
      }

      const runFilter = new reportServerTypes.RunFilter();
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
    cb: (err: RequestFailed, sourceFile: any) => void
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
    cb: (err: RequestFailed, reports: any[]) => void
  ) {
    this.client.getRunResults(runIds, limit, offset, sortType, reportFilter,
      cmpData, this.cbErrWrapper(cb));
  }

  getReport(
    reportId: number,
    cb: (err: RequestFailed, reportData: any) => void
  ) {
    this.client.getReport(reportId, this.cbErrWrapper(cb));
  }

  public getReportDetails(
    reportId: number,
    cb: (err: RequestFailed, reportDetails: any[]) => void
  ) {
    this.client.getReportDetails(reportId, this.cbErrWrapper(cb));
  }

  public getSeverityCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: RequestFailed, severityMap: any) => void
  ) {
    this.client.getSeverityCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getDetectionStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: RequestFailed, detectionStatusMap: any) => void
  ) {
    this.client.getDetectionStatusCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getReviewStatusCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: RequestFailed, reviewStatusMap: any) => void
  ) {
    this.client.getReviewStatusCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getCheckerMsgCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: RequestFailed, fileMap: any) => void
  ) {
    this.client.getCheckerMsgCounts(runIds, reportFilter, cmpData, limit,
      offset, this.cbErrWrapper(cb));
  }

  public getCheckerCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: RequestFailed, fileMap: any) => void
  ) {
    this.client.getCheckerCounts(runIds, reportFilter, cmpData, limit,
      offset, this.cbErrWrapper(cb));
  }

  public getFileCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    limit: number,
    offset: number,
    cb: (err: RequestFailed, fileMap: any) => void
  ) {
    this.client.getFileCounts(runIds, reportFilter, cmpData, limit, offset,
      this.cbErrWrapper(cb));
  }

  public getRunResultCount(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: RequestFailed, reportCount: any) => void
  ) {
    this.client.getRunResultCount(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }

  public getRunReportCounts(
    runIds: number[],
    reportFilter: any,
    limit: number,
    offset: number,
    cb: (err: RequestFailed, reportCount: any) => void
  ) {
    this.client.getRunReportCounts(runIds, reportFilter, limit, offset,
      this.cbErrWrapper(cb));
  }

  public getRunHistoryTagCounts(
    runIds: number[],
    reportFilter: any,
    cmpData: any,
    cb: (err: RequestFailed, reportCount: any) => void
  ) {
    this.client.getRunHistoryTagCounts(runIds, reportFilter, cmpData,
      this.cbErrWrapper(cb));
  }
}
