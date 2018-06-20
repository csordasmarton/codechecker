import { NgFor } from '@angular/common';
import { Component} from '@angular/core';

import { ProductService } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  products : any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    var that = this;

    console.log('GET PRODUCTS');
    productService.getProducts(null, null, (err: any, products : any[]) => {
      that.products = products;
      console.log(products);
    });
  }

  edit() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { id: 1 }});
  }
}