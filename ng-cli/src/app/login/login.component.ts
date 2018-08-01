import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, TokenService } from '../shared';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  submitted: boolean;
  invalidCredentials = false;

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

  onSubmit() {
    this.submitted = true;

    // Stop if form is invalid.
    if (this.loginForm.invalid) {
      return;
    }

    const authString = this.f.username.value + ':' + this.f.password.value;
    this.authenticationService.getClient().performLogin(
      'Username:Password',
      authString
    ).then((token: string) => {
      if (token) {
        this.tokenService.saveToken(token, 365);
        this.invalidCredentials = false;
        // TODO: set url parameters.
        this.router.navigate(['/'], { queryParams: {
        }});
      }
    }).catch(reason => {
      console.log(reason);
      this.invalidCredentials = true;
    });
  }
}
