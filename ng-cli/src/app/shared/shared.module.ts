import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  AtouPipe,
  ColorizeBugPathLengthPipe,
  DetectionStatusToStringPipe,
  DurationPipe,
  FillHeightDirective,
  KeysPipe,
  MapKeysPipe,
  PermissionToStringPipe,
  ReviewStatusToStringPipe,
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
    DetectionStatusToStringPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    MapKeysPipe,
    PermissionToStringPipe,
    ReviewStatusToStringPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ],
  declarations: [
    AtouPipe,
    ColorizeBugPathLengthPipe,
    DetectionStatusToStringPipe,
    DurationPipe,
    FillHeightDirective,
    KeysPipe,
    MapKeysPipe,
    PermissionToStringPipe,
    ReviewStatusToStringPipe,
    SeverityToStringPipe,
    StrToColorPipe,
    SubMenuComponent
  ]
})
export class SharedModule {}
