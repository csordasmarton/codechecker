import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { codeCheckerDBAccess, RunFilter, RunDataList } from '@cc/db-access';

import { BaseService } from './base.service';
import { TokenService } from '.';

@Injectable()
export class DbService extends BaseService<codeCheckerDBAccess.Client> {
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService
  ) {
    super(route, router, tokenService, codeCheckerDBAccess.Client,
      'CodeCheckerService');
  }

  getRunIds(runNames: string[]): Promise<Array<Int64>> {
    return new Promise<Array<Int64>>((resolve, reject): void => {
      if (!runNames) {
        return resolve(null);
      }
      if (!(runNames instanceof Array)) {
        runNames = [runNames];
      }

      const runFilter = new RunFilter();
      runFilter.names = runNames;
      this.getClient().getRunData(runFilter).then((runs: RunDataList) => {
        resolve(runs.map((run) => {
          return run.runId;
        }));
      });
    });
  }
}
