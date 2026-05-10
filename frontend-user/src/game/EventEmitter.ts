type Listener<T = void> = T extends void ? () => void : (payload: T) => void;

export class EventEmitter<EventMap extends Record<string, unknown>> {
  private listeners: {
    [K in keyof EventMap]?: Listener<EventMap[K]>[];
  } = {};

  on<K extends keyof EventMap>(
    event: K,
    listener: Listener<EventMap[K]>,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof EventMap>(
    event: K,
    listener: Listener<EventMap[K]>,
  ): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter((l) => l !== listener) as Listener<
      EventMap[K]
    >[];
  }

  emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K] extends void ? [] : [EventMap[K]]
  ): void {
    const list = this.listeners[event];
    if (!list) return;
    for (const listener of list) {
      (listener as (...a: unknown[]) => void)(...args);
    }
  }
}
