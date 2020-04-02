import IEvent from './event';

export default interface IEventStoreRepository {
  save(event: IEvent, expectedVersion: number): void;
  getEvents(): IEvent[];
  getEventsByAggregateId(id: string): IEvent[];
  getEventByVersion(version: number): IEvent | unknown;
  getEventsFromVersion(version: number): IEvent[];
}
