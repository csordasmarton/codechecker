import { Pipe, PipeTransform } from '@angular/core';

import { ReviewStatus } from '@cc/db-access';

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

  transform(status: ReviewStatus): string {
    return this.util.reviewStatusFromCodeToString(status);
  }
}
