import { Pipe, PipeTransform } from '@angular/core';

import { UtilService } from '..';

/*
 * Converts permission code to string.
 * Example:
 *   {{ 16 | permissionToString }}
 *   returns: 'Product admin'
*/
@Pipe({name: 'permissionToString'})
export class PermissionToStringPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(permissionId: number): string {
    return this.util.permissionFromCodeToString(permissionId);
  }
}
