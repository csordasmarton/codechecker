import { Injectable } from '@angular/core';

let reportServerTypes = require('api/report_server_types');

@Injectable()
export class UtilService {
  /**
   * Converts a Thrift API severity id to human readable string.
   *
   * @param {String|Number} severityCode Thrift API Severity id
   * @return Human readable severity string.
   */
  severityFromCodeToString(severityCode: any): string {
    if (severityCode === 'all')
      return 'All';

    for (var key in reportServerTypes.Severity)
      if (reportServerTypes.Severity[key] === parseInt(severityCode))
        return key;
  }

  /**
   * Converts a Thrift API detection status id to human readable string.
   *
   * @param {String|Number} reviewCode Thrift API DetectionStatus id.
   * @return Human readable review status string.
   */
  public detectionStatusFromCodeToString(detectionStatus: any): string {
    switch (parseInt(detectionStatus)) {
      case reportServerTypes.DetectionStatus.NEW:
        return 'New';
      case reportServerTypes.DetectionStatus.RESOLVED:
        return 'Resolved';
      case reportServerTypes.DetectionStatus.UNRESOLVED:
        return 'Unresolved';
      case reportServerTypes.DetectionStatus.REOPENED:
        return 'Reopened';
      default:
        console.warn('Non existing detection status code: ', detectionStatus);
        return 'N/A';
    }
  }

  /**
   * Converts a Thrift API review status id to human readable string.
   *
   * @param {String|Number} reviewCode Thrift API ReviewStatus id.
   * @return Human readable review status string.
   */
  public reviewStatusFromCodeToString(reviewCode: any): string {
    switch (parseInt(reviewCode)) {
      case reportServerTypes.ReviewStatus.UNREVIEWED:
        return 'Unreviewed';
      case reportServerTypes.ReviewStatus.CONFIRMED:
        return 'Confirmed bug';
      case reportServerTypes.ReviewStatus.FALSE_POSITIVE:
        return 'False positive';
      case reportServerTypes.ReviewStatus.INTENTIONAL:
        return "Intentional";
      default:
        console.warn('Non existing review status code: ', reviewCode);
        return 'N/A';
    }
  }
}