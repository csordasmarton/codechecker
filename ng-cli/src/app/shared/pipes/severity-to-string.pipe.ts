import { Pipe, PipeTransform } from '@angular/core';

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

  transform(severity: number): string {
    return this.util.severityFromCodeToString(severity);
  }
}
