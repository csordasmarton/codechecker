import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
} from '@angular/router';

import { DataTableModule } from 'angular5-data-table';

import { DbService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { RunListComponent } from './run-list.component';

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule.forRoot(),
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
