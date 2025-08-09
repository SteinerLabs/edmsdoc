type EventPayload = {
  label?: string;
  duration?: number;
  fill?: string;
  stroke?: string;
  rotate?: 'auto' | '0';
};

type EventCallback = (edgeId: string, payload?: EventPayload) => void;

class EventBus {
  private listeners: EventCallback[] = [];

  on(cb: EventCallback) {
    this.listeners.push(cb);
  }

  emit(edgeId: string, payload?: EventPayload) {
    for (const cb of this.listeners) cb(edgeId, payload);
  }

  off(cb: EventCallback) {
    const i = this.listeners.indexOf(cb);
    if (i !== -1) this.listeners.splice(i, 1);
  }
}

export const eventBus = new EventBus();
export type { EventPayload, EventCallback };

setInterval(
  () =>
    eventBus.emit('e1-2', {
      label: 'UserCreated',
      duration: 2000,
      fill: '#e6f7ff',
      stroke: '#1890ff',
      rotate: '0' // keep text upright if desired
    }),
  1000
);

setInterval(
  () =>
    eventBus.emit('e2-3', {
      label: 'TestEvent',
      duration: 2000,
      fill: '#e6f7ff',
      stroke: '#1890ff',
      rotate: '0' // keep text upright if desired
    }),
  3000
);

setInterval(
  () =>
    eventBus.emit('e1-3', {
      label: 'TestEvent',
      duration: 2000,
      fill: '#e6f7ff',
      stroke: '#1890ff',
      rotate: '0' // keep text upright if desired
    }),
  2000
);
