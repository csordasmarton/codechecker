import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '.';

const Thrift = require('thrift');
const ccSharedTypes = require('api/shared_types');

@Injectable()
export class BaseService {
  protected client: any;

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

    const transport = Thrift.TBufferedTransport;
    const protocol = Thrift.TJSONProtocol;
    const connection = Thrift.createXHRConnection(SERVER_HOST, SERVER_PORT, {
      transport: transport,
      protocol: protocol,
      path: `${product ? '/' + product : '' }/v${API_VERSION}/${endpoint}`
    });

    // Override parameters of the request object.
    const getXmlHttpRequestObject = connection.getXmlHttpRequestObject;
    connection.getXmlHttpRequestObject = function () {
      const xreq = getXmlHttpRequestObject();
      xreq.withCredentials = true;

      const onreadystatechange = xreq.onreadystatechange;
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

    this.client = Thrift.createXHRClient(thriftService, connection);
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
      if (err && err.errorCode === ccSharedTypes.ErrorCode.UNAUTHORIZED) {
        return this.handleUnauthorized();
      }

      cb(err, args);
    };
  }
}
