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
    this.loadProducts();
  }

  search(query: string) {
    setTimeout(() => {
      this.loadProducts(query + '*');
    }, 200);
  }

  loadProducts(productNameFilter: string = '') {
    this.productService.getClient().getProducts('', productNameFilter).then(
      (products: Product[]) => {
        this.products = products;
        this.productCount = products.length;
      });
  }

  productNameComparator(propA: any, propB: any, rowA: any, rowB: any): void {
    console.log(propA, propB, rowA, rowB);
    console.log(propB);
  }

  public reloadItems(param: any) {
    this.products.sort((a: any, b: any) => {
      let sortByA = a[param['sortBy']];
      let sortByB = b[param['sortBy']];

      if (param['sortBy'] === 'displayedName_b64') {
        sortByA = window.atob(sortByA).toLowerCase();
        sortByB = window.atob(sortByB).toLowerCase();
      }

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
