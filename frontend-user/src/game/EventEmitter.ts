export type EventCallback = (...args: any[]) => void;

export interface EventMap {
  [event: string]: EventCallback;
}

export class EventEmitter {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event)!;
    for (const callback of callbacks) {
      callback(...args);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
