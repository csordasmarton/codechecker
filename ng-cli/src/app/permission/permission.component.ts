import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../shared';

import { PermissionFilter, AuthorisationList } from '@cc/authentication';
import { Permission } from '@cc/shared';

@Component({
  selector: 'permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  addNewUserForm: FormGroup;

  private permissions: Permission[] = null;
  private userRights = {};
  private groupRights = {};

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit() {
    this.addNewUserForm = this.formBuilder.group({
      username: ['', Validators.required]
    });

    const productId = 1; // TODO: this should come from the URL.

    const extraParam = { productID: productId };
    const extraParamsJSON = JSON.stringify(extraParam);

    const scope = 'PRODUCT';
    const filter = new PermissionFilter({ canManage: true });

    this.authService.getClient().getPermissionsForUser(
      scope,
      extraParamsJSON,
      filter
    ).then((permissions: Permission[]) => {
      this.permissions = permissions;
      this.getAuthorizationRights(permissions, extraParamsJSON);
    });
  }

  private getAuthorizationRights(
    permissions: Permission[],
    extraParamsJSON: string
  ) {
    permissions.forEach(permission => {
      this.authService.getClient().getAuthorisedNames(
        permission,
        extraParamsJSON
      ).then((authUserAndGroups: AuthorisationList) => {
        authUserAndGroups.users.forEach((user: string) => {
          if (!this.userRights.hasOwnProperty(user)) {
            this.userRights[user] = [];
          }
          this.userRights[user] = this.userRights[user].concat(permission);
        });

        authUserAndGroups.groups.forEach((group: string) => {
          if (!this.groupRights.hasOwnProperty(group)) {
            this.groupRights[group] = [];
          }
          this.groupRights[group] = this.groupRights[group].concat(
            permission
          );
        });
      });
    });
  }

  addUser() {
    // Stop if form is invalid.
    if (this.addNewUserForm.invalid) {
      return;
    }

    const userName = this.addNewUserForm.controls.username.value;
    this.userRights[userName] = [];
  }
}
