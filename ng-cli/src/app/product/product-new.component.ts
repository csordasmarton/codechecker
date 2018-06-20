import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared';
let productTypes = require('api/products_types');

@Component({
  selector: 'product-new',
  templateUrl: './product-new.component.html'
})
export class ProductNewComponent {
  productName: string = "";
  productDescription: string = "";
  dbConnectionUsername: string = null;
  dbConnectionPassword: string = null;

  product = new productTypes.ProductConfiguration();
  constructor(private productService: ProductService) {
    this.product.connection = new productTypes.DatabaseConnection();
    this.product.connection.engine = 'sqlite';
  }

  addProduct() {
    this.product.displayedName_b64 = window.btoa(this.productName);
    this.product.description_b64 = window.btoa(this.productDescription);
    
    let connection = this.product.connection;
    if (this.product.connection.engine === 'sqlite') {
      connection.host = "";
      connection.port = 0;
      connection.username_b64 = "";
      if (!connection.database)
        connection.database = this.product.endpoint + ".sqlite";
    } else if (this.product.connection.engine === 'postgresql') {
      connection.username_b64 = window.btoa(this.dbConnectionUsername);
      if (this.dbConnectionPassword)
        connection.password_b64 = window.btoa(this.dbConnectionPassword);
      if (!connection.database)
        connection.database = this.product.endpoint;
    }
  }
}