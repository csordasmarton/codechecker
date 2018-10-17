import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';

import { SharedModule } from '../shared/shared.module';
import { BugTreeComponent } from './bug-tree';
import { BugComponent } from './bug.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule,
    TreeModule.forRoot()
  ],
  declarations: [
    BugComponent,
    BugTreeComponent
  ]
})
export class BugModule {}
