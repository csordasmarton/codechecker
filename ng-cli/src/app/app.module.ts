import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BugModule } from './bug/bug.module';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { RunModule } from './run/run.module';

import {
  FooterComponent,
  HeaderComponent,
  ProductService
} from './shared';

import { ROUTES } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    BugModule,
    HomeModule,
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
  providers: [ ProductService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
