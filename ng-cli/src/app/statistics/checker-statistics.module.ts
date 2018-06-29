import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';

import { CheckerStatisticsComponent } from './checker-statistics.component';
import { SharedModule } from '../shared/shared.module';
import { DbService } from '../shared';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CheckerStatisticsComponent
  ],
  providers: [ DbService ]
})
export class CheckerStatisticsModule {}