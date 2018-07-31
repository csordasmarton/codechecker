import { Component} from '@angular/core';

import { ProductService } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';

import { Product } from '@cc/product-management';

@Component({
  selector: 'product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  products: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productService.getClient().getProducts('', '').then(
    (products: Product[]) => {
      this.products = products;
    });
  }

  edit() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { id: 1 }
    });
  }
}
