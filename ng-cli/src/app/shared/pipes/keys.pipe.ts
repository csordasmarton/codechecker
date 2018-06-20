import { Pipe, PipeTransform } from '@angular/core';

/*
 * Returns an array of a given object's own enumerable properties.
 * Example:
 *   let obj = {a: 1, b: 2};
 * 
 *   {{ obj | keys }}
 *   returns: ['a', 'b']
*/
@Pipe({
  name: 'keys',
  pure: false
})
export class KeysPipe implements PipeTransform {
  transform(value: any, args: string[]): any[] {
    return value ? Object.keys(value) : [];
  }
}
