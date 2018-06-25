import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService, TokenService } from '../shared';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  getTokens() {
    this.authenticationService.getTokens((err, tokens) => {
      console.log(err, tokens);
    });
  }

  onSubmit() {
    // Stop if form is invalid.
    if (this.loginForm.invalid)
      return;

    let authString = this.f.username.value + ':' + this.f.password.value;
    this.authenticationService.performLogin("Username:Password", authString,
    (err, token) => {
      if (!err && token) {
        this.tokenService.saveToken(token, 365);
      }
    });
  }
}