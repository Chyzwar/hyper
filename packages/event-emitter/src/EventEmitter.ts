import type EventHandler from "./EventHandler";

type EmitterEventMap = Record<string, EventHandler>;

class EventEmitter<EventMap extends EmitterEventMap> {
  private readonly listeners: Map<keyof EventMap, Set<EventHandler>> = new Map<keyof EventMap, Set<EventHandler>>();

  /**
   * Register Event listener
   */
  public on<E extends keyof EventMap>(name: E, handler: EventMap[E]): this {
    (this.getHandlers(name) ?? this.addHandlers(name)).add(handler);

    return this;
  }

  /**
   * Emit Event
   */
  public emit<E extends keyof EventMap>(name: E, ...args: Parameters<EventMap[E]>): this {
    const handlers = this.getHandlers(name);

    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }

    return this;
  }

  /**
   * Remove event listener
   */
  public removeListener<E extends keyof EventMap>(name: E, handler: EventMap[E]): this {
    const handlers = this.getHandlers(name);

    if (handlers) {
      handlers.delete(handler);
    }

    return this;
  }

  /**
   * Remove all listeners for event
   */
  public removeAllListeners<E extends keyof EventMap>(name: E): this {
    this
      .listeners
      .delete(name);

    return this;
  }

  /**
   * Get Handlers for event
   */
  private getHandlers<E extends keyof EventMap>(name: E): Set<EventHandler> | undefined {
    return this.listeners.get(name);
  }

  /**
   * Create new handlers set for event
   */
  private addHandlers<E extends keyof EventMap>(name: E): Set<EventHandler> {
    const handlers = new Set<EventHandler>();
    this
      .listeners
      .set(name, handlers);

    return handlers;
  }
}

export default EventEmitter;
