import { Pipe, PipeTransform } from '@angular/core';

import { UtilService } from '..';

/*
 * Converts detection status code to string.
 * Example:
 *   {{ 0 | severityToString }}
 *   returns: 'New'
*/
@Pipe({name: 'detectionStatusToString'})
export class DetectionStatusToStringPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(status: number): string {
    return this.util.detectionStatusFromCodeToString(status);
  }
}
