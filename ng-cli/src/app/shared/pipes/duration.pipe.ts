import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts the given number of seconds into a more human-readable
 * 'hh:mm:ss' format.
 * Example:
 *   {{ 119 | duration }}
 *   returns: '00:01:59'
*/
@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    if (seconds >= 0) {
      let durHours = Math.floor(seconds / 3600);
      let durMins  = Math.floor(seconds / 60) - durHours * 60;
      let durSecs  = seconds - durMins * 60 - durHours * 3600;

      let prettyDurHours = (durHours < 10 ? '0' : '') + durHours;
      let prettyDurMins  = (durMins  < 10 ? '0' : '') + durMins;
      let prettyDurSecs  = (durSecs  < 10 ? '0' : '') + durSecs;

      return prettyDurHours + ':' + prettyDurMins + ':' + prettyDurSecs;
    }

    return '-';
  }
}