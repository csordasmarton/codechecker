import { Pipe, PipeTransform } from '@angular/core';

/*
 * Creates a hexadecimal color from a string.
 * Example:
 *   {{ 'apple' | strToColor }}
 *   returns: #8B835A
*/
@Pipe({name: 'strToColor'})
export class StrToColorPipe implements PipeTransform {
  transform(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
