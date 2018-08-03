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
import { GlobalPermissionComponent } from './global-permission.component';
import { GroupPermissionComponent } from './group-permission.component';
import { PermissionComponent } from './permission.component';
import { UserPermissionComponent } from './user-permission.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    GlobalPermissionComponent,
    GroupPermissionComponent,
    PermissionComponent,
    UserPermissionComponent
  ],
  providers: [AuthenticationService]
})
export class PermissionModule {}
