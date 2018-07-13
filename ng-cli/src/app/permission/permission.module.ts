import { ModuleWithProviders, NgModule } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot
} from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";

import { ReactiveFormsModule } from "@angular/forms";

import { PermissionComponent } from "./permission.component";
import { SharedModule } from "../shared/shared.module";
import { AuthenticationService } from "../shared";

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, RouterModule, SharedModule],
  declarations: [PermissionComponent],
  providers: [AuthenticationService]
})
export class PermissionModule {}
