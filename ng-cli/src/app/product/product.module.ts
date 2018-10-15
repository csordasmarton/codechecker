import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ProductService } from '../shared/index';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit.component';
import { ProductNewComponent } from './product-new.component';
import { ProductComponent } from './product.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule,
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
