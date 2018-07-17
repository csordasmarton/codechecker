import { Pipe, PipeTransform } from '@angular/core';

import { UtilService } from '..';

/*
 * Converts review status code to string.
 * Example:
 *   {{ 0 | reviewStatusToString }}
 *   returns: 'Unreviewed'
*/
@Pipe({name: 'reviewStatusToString'})
export class ReviewStatusToStringPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(status: number): string {
    return this.util.reviewStatusFromCodeToString(status);
  }
}
