import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BugModule } from './bug/bug.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { RunModule } from './run/run.module';

import {
  FooterComponent,
  HeaderComponent,
  ProductService,
  UtilService
} from './shared';

import { ROUTES } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    BugModule,
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
    HeaderComponent
  ],
  providers: [ ProductService, UtilService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
