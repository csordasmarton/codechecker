import { Directive, HostBinding, Input } from '@angular/core';

@Directive({selector: '[filterToggle]'})
export class FilterToggleDirective {
  @HostBinding('class.collapsed')
  @Input()
  private filterToggle = true;
}
