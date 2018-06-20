import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'atou'})
export class AtouPipe implements PipeTransform {
  transform(b64: string): string {
    if (!b64) return null;

    return window.atob(b64);
  }
}