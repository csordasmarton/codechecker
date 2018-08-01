import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from '@angular/router';

import { AuthenticationService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { PermissionComponent } from './permission.component';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, RouterModule, SharedModule],
  declarations: [PermissionComponent],
  providers: [AuthenticationService]
})
export class PermissionModule {}
