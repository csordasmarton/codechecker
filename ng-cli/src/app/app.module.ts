import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './_guards';
import { AppComponent } from './app.component';
import { BugModule } from './bug/bug.module';
import { LoginComponent } from './login';
import { PermissionModule } from './permission/permission.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { RunModule } from './run/run.module';
import {
  AuthenticationService,
  FooterComponent,
  HeaderComponent,
  TokenService,
  UtilService
} from './shared';
import { StatisticsModule } from './statistics/statistics.module';

import { ROUTES } from './app.routes';

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
