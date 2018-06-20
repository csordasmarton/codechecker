import { Component} from '@angular/core';

@Component({
  selector: 'product-detail',
  template: `<sub-menu></sub-menu>
             <router-outlet></router-outlet>`
})
export class ProductDetailComponent {}