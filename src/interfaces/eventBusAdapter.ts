import IProjector from './projector';

export default interface IEventBusAdapater {
  subscribe(queue: string, observer: IProjector): void;

  unsubscribe(queue: string, observer: IProjector): void;

  publish(queue: string, message: object): void;
}
