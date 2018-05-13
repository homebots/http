import { IncomingMessage, ServerResponse } from 'http';

export type RouteHandler = (request: IncomingMessage, response: ServerResponse) => void;
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options';

export interface Route {
  method: HttpMethod;
  matcher: RegExp | string;
  handler: RouteHandler;
}

export class Router {
  routes: Route[];

  dispatch(request, response): boolean {
    const route = this.findRoute(request);

    if (route) {
      route.handler(request, response);
      return true;
    }

    return false;
  }

  when(method: HttpMethod, matcher: string | RegExp, handler: RouteHandler) {
    this.routes.push({ method, matcher, handler });
    return this;
  }

  findRoute(request): Route {
    const url = request.url;
    return this.routes.find((x: Route) => url === x.matcher || (x.matcher as RegExp).test(url));
  }
}
