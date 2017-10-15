import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

import 'popper.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css'

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
