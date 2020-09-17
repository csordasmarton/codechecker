import ServiceClient from "@cc/db-access";
import {
  MAX_QUERY_SIZE,
  Order,
  ReportFilter,
  RunFilter,
  SortMode,
  SortType
} from "@cc/report-server-types";

import { BaseService, handleThriftError } from "./_base.service";

class CodeCheckerService extends BaseService {
  constructor() {
    super("CodeCheckerService", ServiceClient);
  }

  getSameReports(bugHash) {
    const reportFilter = new ReportFilter({ reportHash: [ bugHash ] });

    const sortMode = new SortMode({
      type: SortType.FILENAME,
      ord: Order.ASC
    });

    return new Promise(resolve => {
      this.getClient().getRunResults(null, MAX_QUERY_SIZE, 0,
        [ sortMode ], reportFilter, null, false,
        handleThriftError(reports => {
          const runIds = reports.map(report => report.runId);
          this.getRuns(runIds).then(runs => {
            resolve(reports.map(report => {
              const run =
                runs.find(run => run.runId.equals(report.runId)) || {};

              return {
                ...report,
                "$runName": run.name
              };
            }));
          });
        }));
    });
  }

  getRuns(runIds, runNames, limit=null, offset=0, sortMode=null) {
    const runFilter = new RunFilter({
      ids: runIds,
      names: runNames
    });

    return new Promise(resolve => {
      this.getClient().getRunData(runFilter, limit, offset, sortMode,
        handleThriftError(res => {
          resolve(res);
        }));
    });
  }

  async getRunIds(runNames, limit=null, offset=null, sortMode=null) {
    const runs = await this.getRuns(null, runNames, limit, offset, sortMode);
    return runs.map(r => r.runId.toNumber());
  }
}

const ccService = new CodeCheckerService();

export default ccService;
