import { IObserver, IEventBusAdapater, IEvent } from '../../interfaces';

export default class EventBusAdapater implements IEventBusAdapater {
  private static instance: EventBusAdapater;
  private observers = new Map<string, IObserver[]>();

  private constructor() {}

  public static getInstance(): EventBusAdapater {
    if (!EventBusAdapater.instance) {
      EventBusAdapater.instance = new EventBusAdapater();
    }
    return EventBusAdapater.instance;
  }

  public subscribe(queue: string, observer: IObserver): void {
    const obs = this.observers.get(queue);

    if (obs) {
      const isExist = obs.includes(observer);
      if (isExist) {
        return console.log('Observer has been attached already.');
      }
      obs.push(observer);
    } else {
      this.observers.set(queue, [observer]);
    }
  }

  public unsubscribe(queue: string, observer: IObserver): void {
    const obs = this.observers.get(queue);
    if (!obs) {
      return console.log('Nonexistent observer.');
    }
    const observerIndex = obs.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Nonexistent observer.');
    }

    obs.splice(observerIndex, 1);
  }

  public publish(queue: string, event: IEvent): void {
    const obs = this.observers.get(queue);
    if (!obs) {
      return console.log('Nonexistent observer.');
    }
    for (const observer of obs) {
      observer.receive(event);
    }
  }
}
