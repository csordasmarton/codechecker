import { NgModule } from '@angular/core';

import { AtouPipe, StrToColorPipe } from '../shared';

@NgModule({
  exports: [
    AtouPipe,
    StrToColorPipe
  ],
  declarations: [
    AtouPipe,
    StrToColorPipe
  ]
})
export class SharedModule {}