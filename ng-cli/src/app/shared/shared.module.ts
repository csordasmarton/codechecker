import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  AtouPipe,
  ColorizeBugPathLengthPipe,
  DurationPipe,
  FillHeightDirective,
  KeysPipe,
  SeverityToStringPipe,
  StrToColorPipe,
  SubMenuComponent
} from '../shared';

@NgModule({
  imports: [
    RouterModule
  ],
  exports: [
    AtouPipe,
    ColorizeBugPathLengthPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ],
  declarations: [
    AtouPipe,
    ColorizeBugPathLengthPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ]
})
export class SharedModule {}