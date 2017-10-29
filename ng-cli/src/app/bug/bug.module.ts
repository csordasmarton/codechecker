import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { BugComponent } from './bug.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    BugComponent
  ]
})
export class BugModule {}