import { NgFor } from '@angular/common';
import { Component} from '@angular/core';

import { ProductService } from '../shared';

@Component({
  selector: 'product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  products : any[];

  constructor(private productService: ProductService) {
    var that = this;

    productService.getClient().getProducts('', '', (err: any, products : any[]) => {
      that.products = products;
      console.log(products);
    });
  }
}