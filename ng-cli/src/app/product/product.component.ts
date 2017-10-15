import { NgFor } from '@angular/common';
import { Component} from '@angular/core';

import { ProductService } from '../shared';

import './product.component.scss'

@Component({
  selector: 'product-page',
  templateUrl: './product.component.html'
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