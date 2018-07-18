import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductNewComponent } from './product-new.component';
import { ProductEditComponent } from './product-edit.component';
import { ProductService } from '../shared/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ProductComponent,
    ProductDetailComponent,
    ProductNewComponent,
    ProductEditComponent
  ],
  providers: [ ProductService ]
})
export class ProductModule {}
