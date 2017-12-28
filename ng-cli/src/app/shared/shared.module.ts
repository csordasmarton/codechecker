import { NgModule } from '@angular/core';

import {
  AtouPipe,
  DurationPipe,
  FillHeightDirective,
  KeysPipe,
  SeverityToStringPipe,
  StrToColorPipe,
  SubMenuComponent
} from '../shared';

@NgModule({
  exports: [
    AtouPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ],
  declarations: [
    AtouPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ]
})
export class SharedModule {}