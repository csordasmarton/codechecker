import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { CommonPermissionComponent } from './common-permission.component';

@Component({
  selector: 'group-permission',
  templateUrl: './group-permission.component.html'
})
export class GroupPermissionComponent extends CommonPermissionComponent
implements OnInit {
  protected isGroup = true;

  public ngOnInit() {
    this.addAuthNameForm = this.formBuilder.group({
      group: ['', Validators.required]
    });
  }

  addAuthName() {
    // Stop if form is invalid.
    if (this.addAuthNameForm.invalid) {
      return;
    }

    const authName = this.addAuthNameForm.controls.group.value;
    this.authRights[authName] = [];
    this.addAuthNameForm.controls.group.setValue(null);
  }
}
