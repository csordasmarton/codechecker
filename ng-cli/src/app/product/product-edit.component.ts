import { Component, OnInit} from '@angular/core';

import { ProductService } from '../shared';
import { ActivatedRoute } from '@angular/router';
const productTypes = require('api/products_types');

@Component({
  selector: 'product-edit',
  templateUrl: './product-new.component.html'
})
export class ProductEditComponent {
  productName = '';
  productDescription = '';
  dbConnectionUsername: string = null;
  dbConnectionPassword: string = null;

  private product = new productTypes.ProductConfiguration();
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
    const endpoint = this.route.snapshot.params['endpoint'];
    this.product.connection = new productTypes.DatabaseConnection();

    this.productService.getProducts(endpoint, null, (err: any, products: any) => {
      let currentProduct = products.filter((product: any) => {
        return product.endpoint === endpoint;
      });

      if (currentProduct.length) {
        currentProduct = currentProduct[0];

        this.productService.getProductConfiguration(currentProduct.id,
        (configErr: any, config: any) => {
          console.log(config);
          this.product = config;
        });
      }
      //   this.product = currentProduct[0]
    });
  }

  addProduct() {
  }
}
