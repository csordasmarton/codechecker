import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';

import { CheckerStatisticsComponent } from './checker-statistics.component';
import { SeverityStatisticsComponent } from './severity-statistics.component';
import { SharedModule } from '../shared/shared.module';
import { DbService } from '../shared';
import { StatisticsComponent } from '.';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CheckerStatisticsComponent,
    SeverityStatisticsComponent,
    StatisticsComponent
  ],
  providers: [ DbService ]
})
export class StatisticsModule {}