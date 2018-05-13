import { ServerResponse } from 'http';

export function toJson(x) {
  return JSON.stringify(x, null, ' ');
}

export interface Response extends ServerResponse {
  send: (code: number, headers: object, body?: object | string) => void;
  json: (object: object) => void;
  headers: (headers: object) => this;
}

export class Response {
  static create(r: ServerResponse): Response {
    const response: Response = Object.create(r);

    response.send = send;
    response.headers = setHeaders;
    response.json = json;

    return response;
  }
}

function json(object: object) {
  (this as Response).send(200, { 'Content-Type': 'application/json' }, object);
}

function setHeaders(headers: object): Response {
  Object.keys(headers).forEach((name) => {
    (this as ServerResponse).setHeader(name, headers[name]);
  });

  return this;
}

function send(code: number, headers: object, body?: object | string) {
  if (arguments.length === 2) {
    body = headers;
    headers = null;
  }

  if (headers) {
    this.headers(headers);
  }

  if (typeof body === 'object') {
    body = toJson(body);
  }

  this.writeHead(code, headers);
  this.write(body);
}
