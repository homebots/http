import { Server, IncomingMessage, createServer } from 'http';
import { Router } from './router';
import { Response } from './response';

export const defaultPort = 97700;

export interface HttpOptions {
  port: number;
}

export class HttpServer {
  port: number;
  server: Server;
  router: Router;

  constructor(options: HttpOptions) {
    this.port = options && options.port || defaultPort;
    this.server = createServer((req, res) => this.dispatch(req, Response.create(res)));
  }

  dispatch(request: IncomingMessage, response: Response) {
    const dispatched = this.router.dispatch(request, response);

    if (!dispatched) {
      this.whenNotFound(response);
    }
  }

  setRouter(router: Router) {
    this.router = router;
    return this;
  }

  whenNotFound(response: Response) {
    response.send(200, { 'Content-Type': 'application/json' }, { error: 'Not found' });
  }

  start() {
    this.server.listen(this.port);
    return this;
  }
}
