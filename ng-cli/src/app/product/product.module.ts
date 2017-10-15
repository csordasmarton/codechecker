import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './product.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ProductComponent
  ]
})
export class ProductModule {}