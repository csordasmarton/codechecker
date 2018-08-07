import { Pipe, PipeTransform } from '@angular/core';

import { Severity } from '@cc/db-access';

import { UtilService } from '..';

/*
 * Converts severity status code to string.
 * Example:
 *   {{ 40 | severityToString }}
 *   returns: 'High'
*/
@Pipe({name: 'severityToString'})
export class SeverityToStringPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(severity: Severity): string {
    return this.util.severityFromCodeToString(severity);
  }
}
