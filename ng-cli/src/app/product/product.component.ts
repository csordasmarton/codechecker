import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '@cc/product-management';

import { ProductService } from '../shared';

@Component({
  selector: 'product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  products: any[] = [];
  productCount = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productService.getClient().getProducts('', '').then(
    (products: Product[]) => {
      this.products = products;
      this.productCount = products.length;
    });
  }

  // TODO: implement it.
  public reloadItems(param: any) {
    this.products.sort((a: any, b: any) => {
      const sortByA = a[param['sortBy']];
      const sortByB = b[param['sortBy']];

      if (sortByA > sortByB) {
        return param.sortAsc ? -1 : 1;
      } else if (sortByA < sortByB) {
        return param.sortAsc ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  edit() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { id: 1 }
    });
  }
}
