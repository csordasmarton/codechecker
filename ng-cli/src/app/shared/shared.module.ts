import { NgModule } from '@angular/core';

import { AtouPipe, DurationPipe, StrToColorPipe, SubMenuComponent } from '../shared';

@NgModule({
  exports: [
    AtouPipe,
    DurationPipe,
    StrToColorPipe,
    SubMenuComponent
  ],
  declarations: [
    AtouPipe,
    DurationPipe,
    StrToColorPipe,
    SubMenuComponent
  ]
})
export class SharedModule {}