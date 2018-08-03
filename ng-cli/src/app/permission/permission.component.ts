import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Int64 = require('node-int64');

import { AuthorisationList, PermissionFilter } from '@cc/authentication';
import { Products } from '@cc/product-management';
import { Permission } from '@cc/shared';

import { AuthenticationService, ProductService } from '../shared';
import { GroupPermissionComponent } from './group-permission.component';
import { UserPermissionComponent } from './user-permission.component';

@Component({
  selector: 'permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  protected permissions: Permission[] = null;
  protected userRights: {[key: string]: Permission[]} = {};
  protected groupRights: {[key: string]: Permission[]} = {};
  protected extraParamsJSON: string = null;

  @ViewChild(UserPermissionComponent)
    userPermissionComponent: UserPermissionComponent;

  @ViewChild(GroupPermissionComponent)
    groupPermissionComponent: GroupPermissionComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit() {
    const endpoint = this.route.snapshot.params['endpoint'];
    this.productService.getClient().getProducts(endpoint, '').then(
      (products: Products) => {
        if (products.length) {
          const currentProduct = products[0];
          this.loadPermissions(currentProduct.id);
        } else {
          // TODO: Handle case when product cannot be found.
          console.warn(`Product with the following endpoint name can not be
            found: ${endpoint}`);
        }
    });
  }

  loadPermissions(productId: Int64) {
    const extraParam = { productID: productId.toNumber() };
    this.extraParamsJSON = JSON.stringify(extraParam);

    const scope = 'PRODUCT';
    const filter = new PermissionFilter({ canManage: true });

    this.authService.getClient().getPermissionsForUser(
      scope,
      this.extraParamsJSON,
      filter
    ).then((permissions: Permission[]) => {
      this.permissions = permissions;
      this.getAuthorizationRights(permissions, this.extraParamsJSON);
    });
  }

  protected getAuthorizationRights(
    permissions: Permission[],
    extraParamsJSON: string
  ) {
    permissions.forEach(permission => {
      this.authService.getClient().getAuthorisedNames(
        permission,
        extraParamsJSON
      ).then((authUserAndGroups: AuthorisationList) => {
        this.addAuthorizations(this.userRights, authUserAndGroups.users,
          permission);
        this.addAuthorizations(this.groupRights, authUserAndGroups.groups,
          permission);
      });
    });
  }

  addAuthorizations(
    authRights: {[key: string]: Permission[]},
    authorizations: string[],
    permission: Permission
  ) {
    authorizations.forEach((user: string) => {
      if (!authRights.hasOwnProperty(user)) {
        authRights[user] = [];
      }
      authRights[user] = authRights[user].concat(permission);
    });
  }

  saveAll() {
    this.userPermissionComponent.saveAll();
    this.groupPermissionComponent.saveAll();
  }
}
