import { NgModule } from '@angular/core';

import {
  AtouPipe,
  DurationPipe,
  KeysPipe,
  SeverityToStringPipe,
  StrToColorPipe,
  SubMenuComponent
} from '../shared';

@NgModule({
  exports: [
    AtouPipe,
    DurationPipe,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ],
  declarations: [
    AtouPipe,
    DurationPipe,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ]
})
export class SharedModule {}