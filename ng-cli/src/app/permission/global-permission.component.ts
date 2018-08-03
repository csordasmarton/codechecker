import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { PermissionFilter } from '@cc/authentication';
import { Permission } from '@cc/shared';

import { PermissionComponent } from './permission.component';

@Component({
  selector: 'global-permission',
  templateUrl: './global-permission.component.html'
})
export class GlobalPermissionComponent extends PermissionComponent
implements OnInit {
  protected permissions: Permission[] = [ Permission.SUPERUSER ];

  public ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    const extraParam = { };
    this.extraParamsJSON = JSON.stringify(extraParam);

    const scope = 'SYSTEM';
    const filter = new PermissionFilter({ canManage: true });

    this.getAuthorizationRights(this.permissions, this.extraParamsJSON);
  }
}
