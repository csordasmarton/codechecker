import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard } from './_guards';
import { AppComponent } from './app.component';
import { BugModule } from './bug/bug.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { RunModule } from './run/run.module';
import { StatisticsModule } from './statistics/statistics.module';

import {
  FooterComponent,
  HeaderComponent,
  UtilService,
  AuthenticationService,
  TokenService
} from './shared';

import { ROUTES } from './app.routes';
import { LoginComponent } from './login';
import { PermissionModule } from './permission/permission.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BugModule,
    StatisticsModule,
    PermissionModule,
    ProductModule,
    ReportModule,
    RunModule,
    RouterModule.forRoot(ROUTES, {
      useHash: false
    })
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    TokenService,
    UtilService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
