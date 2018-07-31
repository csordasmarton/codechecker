import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared';

import {
  ProductConfiguration,
  DatabaseConnection } from '@cc/product-management';

@Component({
  selector: 'product-new',
  templateUrl: './product-new.component.html'
})
export class ProductNewComponent {
  productName = '';
  productDescription = '';
  dbConnectionUsername: string = null;
  dbConnectionPassword: string = null;

  product = new ProductConfiguration();
  constructor(private productService: ProductService) {
    this.product.connection = new DatabaseConnection();
    this.product.connection.engine = 'sqlite';
  }

  addProduct() {
    this.product.displayedName_b64 = window.btoa(this.productName);
    this.product.description_b64 = window.btoa(this.productDescription);

    const connection = this.product.connection;
    if (this.product.connection.engine === 'sqlite') {
      connection.host = '';
      connection.port = 0;
      connection.username_b64 = '';
      if (!connection.database) {
        connection.database = this.product.endpoint + '.sqlite';
      }
    } else if (this.product.connection.engine === 'postgresql') {
      connection.username_b64 = window.btoa(this.dbConnectionUsername);
      if (this.dbConnectionPassword) {
        connection.password_b64 = window.btoa(this.dbConnectionPassword);
      }
      if (!connection.database) {
        connection.database = this.product.endpoint;
      }
    }
  }
}
