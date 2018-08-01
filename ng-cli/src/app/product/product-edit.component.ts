import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  DatabaseConnection,
  Product,
  ProductConfiguration
} from '@cc/product-management';

import { ProductService } from '../shared';

@Component({
  selector: 'product-edit',
  templateUrl: './product-new.component.html'
})
export class ProductEditComponent {
  productName = '';
  productDescription = '';
  dbConnectionUsername: string = null;
  dbConnectionPassword: string = null;

  private product = new ProductConfiguration();
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
    const endpoint = this.route.snapshot.params['endpoint'];
    this.product.connection = new DatabaseConnection();

    this.productService.getClient().getProducts(endpoint, '').then(
    (products: Product[]) => {
      const currentProducts = products.filter((product: any) => {
        return product.endpoint === endpoint;
      });

      if (currentProducts.length) {
        const currentProduct: Product = currentProducts[0];

        this.productService.getClient().getProductConfiguration(
          currentProduct.id
        ).then((config: ProductConfiguration) => {
          this.product = config;
        });
      }
      //   this.product = currentProduct[0]
    });
  }

  addProduct() {
  }
}
