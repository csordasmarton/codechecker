import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { RunListComponent } from './run-list.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    RunListComponent
  ],
  providers: [ DbService ]
})
export class RunModule {}
