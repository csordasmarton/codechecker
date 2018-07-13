import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthenticationService } from "../shared";

let authTypes = require("api/authentication_types");

@Component({
  selector: "permission",
  templateUrl: "./permission.component.html",
  styleUrls: ["./permission.component.scss"]
})
export class PermissionComponent implements OnInit {
  addNewUserForm: FormGroup;

  private permissions: [number] = null;
  private userRights = {};
  private groupRights = {};

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit() {
    this.addNewUserForm = this.formBuilder.group({
      username: ["", Validators.required]
    });

    let productId = 1; // TODO: this should come from the URL.

    let extraParam = { productID: productId };
    let extraParamsJSON = JSON.stringify(extraParam);

    let scope = "PRODUCT";
    var filter = new authTypes.PermissionFilter({ canManage: true });

    this.authService.getPermissionsForUser(
      scope,
      extraParamsJSON,
      filter,
      (err, permissions) => {
        this.permissions = permissions;
        this.getAuthorizationRights(permissions, extraParamsJSON);
      }
    );
  }

  private getAuthorizationRights(permissions: [any], extraParamsJSON: string) {
    permissions.forEach(permission => {
      this.authService.getAuthorisedNames(
        permission,
        extraParamsJSON,
        (err, authUserAndGroups) => {
          authUserAndGroups.users.forEach((user: string) => {
            if (!this.userRights.hasOwnProperty(user))
              this.userRights[user] = [];
            this.userRights[user] = this.userRights[user].concat(permission);
          });

          authUserAndGroups.groups.forEach((group: string) => {
            if (!this.groupRights.hasOwnProperty(group))
              this.groupRights[group] = [];
            this.groupRights[group] = this.groupRights[group].concat(
              permission
            );
          });
        }
      );
    });
  }

  addUser() {
    // Stop if form is invalid.
    if (this.addNewUserForm.invalid)
      return;

    let userName = this.addNewUserForm.controls.username.value;
    this.userRights[userName] = [];
  }
}
