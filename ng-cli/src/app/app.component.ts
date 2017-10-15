import { Component } from '@angular/core';

import { ProductService } from './shared';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version: string;

  constructor(private productService: ProductService) {
    var that = this;

    productService.getClient().getPackageVersion((err: any, version : string) => {
      that.version = version;
    });

    productService.getClient().getProducts('', '', (err: any, products : any[]) => {
      /* console.log(products); */
    });
  }
}
