export class EventBus {
  private static _instance = new EventBus();

  private listeners: any = {};

  static get instance() {
    return EventBus._instance;
  }

  on(event: string, listener: Function): EventBus {
    if (!(event in this.listeners)) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): EventBus {
    if (event in this.listeners) {
      this.listeners[event].forEach((listener: Function) => {
        listener.apply(null, args);
      });
    }
    return this;
  }
}
