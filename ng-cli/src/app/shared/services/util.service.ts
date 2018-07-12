import { Injectable } from '@angular/core';

let reportServerTypes = require('api/report_server_types');

@Injectable()
export class UtilService {
  /**
   * Converts a Thrift API severity id to human readable string.
   *
   * @param {String|Number} severity Thrift API Severity id
   * @return Human readable severity string.
   */
  severityFromCodeToString(severity: any): string {
    switch (parseInt(severity)) {
      case reportServerTypes.Severity.UNSPECIFIED:
        return 'Unspecified';
      case reportServerTypes.Severity.STYLE:
        return 'Style';
      case reportServerTypes.Severity.LOW:
        return 'Low';
      case reportServerTypes.Severity.MEDIUM:
        return 'Medium';
      case reportServerTypes.Severity.HIGH:
        return 'High';
      case reportServerTypes.Severity.CRITICAL:
        return 'Critical';
      default:
        console.warn('Non existing severity status code: ', severity);
        return 'N/A';
    }
  }

  severityFromStringToCode(severity: string) {
    switch (severity.toLowerCase()) {
      case 'unspecified':
        return reportServerTypes.Severity.UNSPECIFIED;
      case 'style':
        return reportServerTypes.Severity.STYLE;
      case 'low':
        return reportServerTypes.Severity.LOW;
      case 'medium':
        return reportServerTypes.Severity.MEDIUM;
      case 'high':
        return reportServerTypes.Severity.HIGH;
      case 'critical':
        return reportServerTypes.Severity.CRITICAL;
      default:
        console.warn('Non existing severity: ', severity);
        return -1;
    }
  }

  /**
   * Converts a Thrift API detection status id to human readable string.
   *
   * @param {String|Number} reviewCode Thrift API DetectionStatus id.
   * @return Human readable review status string.
   */
  detectionStatusFromCodeToString(detectionStatus: any): string {
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

  detectionStatusFromStringToCode(status: string) {
    switch (status.toLowerCase()) {
      case 'new':
        return reportServerTypes.DetectionStatus.NEW;
      case 'resolved':
        return reportServerTypes.DetectionStatus.RESOLVED;
      case 'unresolved':
        return reportServerTypes.DetectionStatus.UNRESOLVED;
      case 'reopened':
        return reportServerTypes.DetectionStatus.REOPENED;
      default:
        console.warn('Non existing detection status: ', status);
        return -1;
    }
  }

  /**
   * Converts a Thrift API review status id to human readable string.
   *
   * @param {String|Number} reviewCode Thrift API ReviewStatus id.
   * @return Human readable review status string.
   */
  reviewStatusFromCodeToString(reviewCode: any): string {
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

  reviewStatusFromStringToCode(status: string) {
    switch (status.toLowerCase()) {
      case 'unreviewed':
        return reportServerTypes.ReviewStatus.UNREVIEWED;
      case 'confirmed bug':
        return reportServerTypes.ReviewStatus.CONFIRMED;
      case 'false positive':
        return reportServerTypes.ReviewStatus.FALSE_POSITIVE;
      case 'intentional':
        return reportServerTypes.ReviewStatus.INTENTIONAL;
      default:
        console.warn('Non existing review status: ', status);
        return -1;
    }
  }

  generateRedGreenGradientColor(value: number, max: number, opacity: number) {
    let red = (255 * value) / max;
    let green = (255 * (max - value)) / max;
    let blue = 0;
    return 'rgba(' + Number(red) + ',' + Number(green) + ',' + blue
      + ',' + opacity + ')';
  }
}