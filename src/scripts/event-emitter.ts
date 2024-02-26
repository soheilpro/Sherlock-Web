export class Event {
}

export interface EventListener<TEvent extends Event = Event> {
  (event?: TEvent): void;
}

export interface IEventEmitter<TEventType extends string> {
  addEventListener<TEvent extends Event>(type: TEventType, listener: EventListener<TEvent>): void;
  removeEventListener<TEvent extends Event>(type: TEventType, listener: EventListener<TEvent>): void;
}

export class EventEmitter<TEventType extends string> implements IEventEmitter<TEventType> {
  private event_listeners: { [type: string]: EventListener[]; } = {};

  public addEventListener<TEvent extends Event>(type: TEventType, listener: EventListener<TEvent>): void {
    if (!this.event_listeners[type])
      this.event_listeners[type] = [];

    this.event_listeners[type].push(listener as EventListener);
  }

  public removeEventListener<TEvent extends Event>(type: TEventType, listener: EventListener<TEvent>): void {
    if (!this.event_listeners[type])
      return;

    this.event_listeners[type] = this.event_listeners[type].filter(l => l !== listener);
  }

  protected emit(type: TEventType, event?: Event): void {
    for (const listener of (this.event_listeners[type] || []))
      listener(event);
  }
}
