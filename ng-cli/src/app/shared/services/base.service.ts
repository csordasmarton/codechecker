import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '.';

import {
  createXHRClient,
  createXHRConnection,
  TBufferedTransport,
  TJSONProtocol} from 'thrift';

import { ErrorCode } from '@cc/shared';

@Injectable()
export class BaseService<T> {
  protected client: T;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected tokenService: TokenService,
    protected thriftService: any,
    protected endpoint: String
  ) {
    const self = this;

    const product = router.routerState.snapshot.root.children.length
      ? router.routerState.snapshot.root.children[0].params['product']
      : null;

    const host = process.env.SERVER_HOST || window.location.hostname;
    const port = parseInt(process.env.SERVER_PORT, 10) || parseInt(window.location.port, 10);
    const api = process.env.API_VERSION;

    const connection = createXHRConnection(host, port, {
      transport: TBufferedTransport,
      protocol: TJSONProtocol,
      path: `${product ? '/' + product : '' }/v${api}/${endpoint}`
    });

    // Override parameters of the request object.
    const getXmlHttpRequestObject = connection.getXmlHttpRequestObject;
    connection.getXmlHttpRequestObject = function () {
      const xreq = getXmlHttpRequestObject();
      xreq.withCredentials = true;

      xreq.addEventListener('readystatechange', function () {
        // Handle unauthorized responses.
        if (this.readyState === 4 && this.status === 401) {
          self.handleUnauthorized();
        } else if (this.readyState === 4 && this.status === 504) {
          console.log('TODO: handle unavailable service event!');
        }
      });

      return xreq;
    };

    this.client = createXHRClient(thriftService, connection);
  }

  public getClient() {
    return this.client;
  }

  private handleUnauthorized() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  protected cbErrWrapper(cb: (err: any, args: any) => void) {
    return (err: any, args: any) => {
      if (err && err.errorCode === ErrorCode.UNAUTHORIZED) {
        return this.handleUnauthorized();
      }

      cb(err, args);
    };
  }
}
