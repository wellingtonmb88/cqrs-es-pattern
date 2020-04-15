import IEvent from './event';

export default interface IEventStoreRepository {
  save(event: IEvent, expectedVersion: number): void;
  getEvents(): IEvent[] | Promise<IEvent[]>;
  getEventsByAggregateId(id: string): IEvent[] | Promise<IEvent[]>;
  getEventByVersion(version: number): IEvent | Promise<IEvent> | undefined;
  getEventsFromVersion(version: number): IEvent[] | Promise<IEvent[]>;
}
