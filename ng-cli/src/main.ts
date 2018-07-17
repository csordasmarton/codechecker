import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

import 'popper.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'angular-tree-component/dist/angular-tree-component.css';

import './assets/fonts/codechecker.scss';
import './styles.scss';

import 'font-awesome/css/font-awesome.css';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
