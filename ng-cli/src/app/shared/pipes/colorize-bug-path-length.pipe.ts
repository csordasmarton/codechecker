import { Pipe, PipeTransform } from '@angular/core';

import { UtilService } from '..';

/*
 * Creates a gradient color for bug path length.
 * Example:
 *   {{ 40 | colorizeBugPathLength }}
 *   returns: '#8B835A'
*/
@Pipe({name: 'colorizeBugPathLength'})
export class ColorizeBugPathLengthPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(bugPathLength: number, limit : number): string {
    // This value says that bug path length with this value and above are
    // difficult to understand. The background color of these bug path lengths
    // will be red.
    if (limit === undefined)
      limit = 20;

    return this.util.generateRedGreenGradientColor(bugPathLength, limit, 0.5);
  }
}
