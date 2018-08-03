import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { CommonPermissionComponent } from './common-permission.component';

@Component({
  selector: 'user-permission',
  templateUrl: './user-permission.component.html'
})
export class UserPermissionComponent extends CommonPermissionComponent
implements OnInit {
  public ngOnInit() {
    this.addAuthNameForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  addAuthName() {
    // Stop if form is invalid.
    if (this.addAuthNameForm.invalid) {
      return;
    }

    const authName = this.addAuthNameForm.controls.username.value;
    this.authRights[authName] = [];
    this.addAuthNameForm.controls.username.setValue(null);
  }
}
