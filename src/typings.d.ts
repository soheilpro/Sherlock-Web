declare interface ExtendableEvent extends Event {
  waitUntil(promise: PromiseLike<any>): void;
}

declare interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: PromiseLike<Response>): void;
}
