import { Injectable } from '@angular/core';

import {
  DetectionStatus,
  ReviewStatus,
  Severity,
} from '@cc/db-access';

import { Permission } from '@cc/shared';

@Injectable()
export class UtilService {
  /**
   * Converts a Thrift API severity id to human readable string.
   *
   * @param {String|Number} severity Thrift API Severity id
   * @return Human readable severity string.
   */
  severityFromCodeToString(severity: Severity): string {
    switch (severity) {
      case Severity.UNSPECIFIED:
        return 'Unspecified';
      case Severity.STYLE:
        return 'Style';
      case Severity.LOW:
        return 'Low';
      case Severity.MEDIUM:
        return 'Medium';
      case Severity.HIGH:
        return 'High';
      case Severity.CRITICAL:
        return 'Critical';
      default:
        console.warn('Non existing severity status code: ', severity);
        return 'N/A';
    }
  }

  severityFromStringToCode(severity: string) {
    switch (severity.toLowerCase()) {
      case 'unspecified':
        return Severity.UNSPECIFIED;
      case 'style':
        return Severity.STYLE;
      case 'low':
        return Severity.LOW;
      case 'medium':
        return Severity.MEDIUM;
      case 'high':
        return Severity.HIGH;
      case 'critical':
        return Severity.CRITICAL;
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
  detectionStatusFromCodeToString(detectionStatus: DetectionStatus): string {
    switch (detectionStatus) {
      case DetectionStatus.NEW:
        return 'New';
      case DetectionStatus.RESOLVED:
        return 'Resolved';
      case DetectionStatus.UNRESOLVED:
        return 'Unresolved';
      case DetectionStatus.REOPENED:
        return 'Reopened';
      default:
        console.warn('Non existing detection status code: ', detectionStatus);
        return 'N/A';
    }
  }

  detectionStatusFromStringToCode(status: string) {
    switch (status.toLowerCase()) {
      case 'new':
        return DetectionStatus.NEW;
      case 'resolved':
        return DetectionStatus.RESOLVED;
      case 'unresolved':
        return DetectionStatus.UNRESOLVED;
      case 'reopened':
        return DetectionStatus.REOPENED;
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
  reviewStatusFromCodeToString(reviewCode: ReviewStatus): string {
    switch (reviewCode) {
      case ReviewStatus.UNREVIEWED:
        return 'Unreviewed';
      case ReviewStatus.CONFIRMED:
        return 'Confirmed bug';
      case ReviewStatus.FALSE_POSITIVE:
        return 'False positive';
      case ReviewStatus.INTENTIONAL:
        return 'Intentional';
      default:
        console.warn('Non existing review status code: ', reviewCode);
        return 'N/A';
    }
  }

  reviewStatusFromStringToCode(status: string) {
    switch (status.toLowerCase()) {
      case 'unreviewed':
        return ReviewStatus.UNREVIEWED;
      case 'confirmed bug':
        return ReviewStatus.CONFIRMED;
      case 'false positive':
        return ReviewStatus.FALSE_POSITIVE;
      case 'intentional':
        return ReviewStatus.INTENTIONAL;
      default:
        console.warn('Non existing review status: ', status);
        return -1;
    }
  }

  /**
   * Converts a Thrift API permission id to human readable string.
   *
   * @param {String|Number} permissionId Thrift API Permission id.
   * @return Human readable permission string.
   */
  permissionFromCodeToString(permissionId: any) {
    switch (parseInt(permissionId, 10)) {
      case Permission.SUPERUSER:
        return 'Superuser';
      case Permission.PRODUCT_ADMIN:
        return 'Product admin';
      case Permission.PRODUCT_ACCESS:
        return 'Product access';
      case Permission.PRODUCT_STORE:
        return 'Product store';
      default:
        console.warn('Non existing permission code: ', permissionId);
        return 'N/A';
    }
  }

  generateRedGreenGradientColor(value: number, max: number, opacity: number) {
    const red = (255 * value) / max;
    const green = (255 * (max - value)) / max;
    const blue = 0;
    return 'rgba(' + Number(red) + ',' + Number(green) + ',' + blue
      + ',' + opacity + ')';
  }
}
