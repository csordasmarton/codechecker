import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Permission } from '@cc/shared';

import { AuthenticationService } from '../shared';

@Component({
  selector: 'permission',
  template: ''
})
export class CommonPermissionComponent {
  addAuthNameForm: FormGroup;

  protected isGroup = false;
  @Input() private permissions: Permission[] = null;
  @Input() protected authRights: {[key: string]: Permission[]} = {};
  private changedAuthRights: {[key: string]: Permission[]} = {};
  @Input() private extraParamsJSON: string = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    protected formBuilder: FormBuilder
  ) {}

  addAuthorizations(authorizations: string[], permission: Permission) {
    authorizations.forEach((user: string) => {
      if (!this.authRights.hasOwnProperty(user)) {
        this.authRights[user] = [];
      }
      this.authRights[user] = this.authRights[user].concat(permission);
    });
  }

  changeAuthPermission(authName: string, permission: Permission) {
    if (this.changedAuthRights[authName] &&
        this.changedAuthRights[authName].indexOf(permission) !== -1
    ) {
      // Removing a permission to the user.
      const ind = this.changedAuthRights[authName].indexOf(permission);
      this.changedAuthRights[authName].splice(ind, 1);

      // Remove the user from the changes if there is no more permissions.
      if (!this.changedAuthRights[authName].length) {
        delete this.changedAuthRights[authName];
      }
    } else {
      // Add new permission to the user.
      if (!this.changedAuthRights.hasOwnProperty(authName)) {
        this.changedAuthRights[authName] = [];
      }
      this.changedAuthRights[authName].push(permission);
    }
  }

  saveAll() {
    for (const username of Object.keys(this.changedAuthRights)) {
      this.changedAuthRights[username].forEach((permission: Permission) => {
        if (this.authRights[username] &&
            this.authRights[username].indexOf(permission) !== -1
        ) {
          this.authService.getClient().removePermission(permission, username,
            this.isGroup, this.extraParamsJSON).then((success: boolean) => {
              if (success) {
                const ind = this.authRights[username].indexOf(permission);
                this.authRights[username].splice(ind, 1);
                if (!this.authRights[username].length) {
                  delete this.authRights[username];
                }
              }
            });
        } else {
          this.authService.getClient().addPermission(permission, username,
            this.isGroup, this.extraParamsJSON).then((success: boolean) => {
              if (success) {
                if (!this.authRights.hasOwnProperty(username)) {
                  this.authRights[username] = [];
                }
                this.authRights[username].push(permission);
              }
            });
        }
      });
    }

    // Reset the store of changes.
    this.changedAuthRights = {};
  }
}
