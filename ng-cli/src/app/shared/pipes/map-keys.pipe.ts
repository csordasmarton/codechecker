import { Pipe, PipeTransform } from '@angular/core';

/*
 * Returns an array of a given object's own enumerable properties.
 * Example:
 *   let obj = {a: 1, b: 2};
 *
 *   {{ obj | mapKeys }}
 *   returns: ['a', 'b']
*/
@Pipe({
  name: 'mapKeys',
  pure: false
})
export class MapKeysPipe implements PipeTransform {
  transform(value: Map<any, any>, args: string[]): any[] {
    return value ? Array.from(value.keys()).sort() : [];
  }
}
