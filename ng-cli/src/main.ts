import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

import 'popper.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/fonts/codechecker.scss';
import './styles.css';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
