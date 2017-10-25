import { NgModule } from '@angular/core';

import { AtouPipe, DurationPipe, StrToColorPipe } from '../shared';

@NgModule({
  exports: [
    AtouPipe,
    DurationPipe,
    StrToColorPipe
  ],
  declarations: [
    AtouPipe,
    DurationPipe,
    StrToColorPipe
  ]
})
export class SharedModule {}