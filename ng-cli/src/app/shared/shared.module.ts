import { NgModule } from '@angular/core';

import { AtouPipe } from '../shared';

@NgModule({
  exports: [
    AtouPipe
  ],
  declarations: [
    AtouPipe
  ]
})
export class SharedModule {}