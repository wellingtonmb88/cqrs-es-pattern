import { IEvent, IEventStoreRepository } from '../../interfaces';

export default class EventStore implements IEventStoreRepository {
  private db: IEvent[] = [];

  save(event: IEvent, expectedVersion: number): void {
    if (this.db.length != expectedVersion) {
      throw new Error('Error event version!');
    }
    event.version = expectedVersion;
    this.db.push(event);
  }

  getEvents(): IEvent[] {
    return this.db;
  }

  getEventsByAggregateId(id: string): IEvent[] {
    return this.db.filter((e) => e.aggregateId === id);
  }

  getEventByVersion(version: number): IEvent | unknown {
    return this.db.find((e) => e.version === version);
  }

  getEventsFromVersion(version: number): IEvent[] {
    const startIndex = this.db.findIndex((e) => e.version === version);
    return this.db.slice(startIndex, this.db.length);
  }
}
