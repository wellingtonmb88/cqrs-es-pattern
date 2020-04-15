import EventStore from '../example/eventstore';
import { IEvent } from '../interfaces';

test('EventStore', async () => {
  const eventStore = new EventStore();

  const event1: IEvent = {
    type: 'AccountCreated',
    aggregateId: 'aggregateId-1',
    payload: { status: 'created' },
    timestamp: new Date().getTime(),
  };

  eventStore.save(event1, 0);

  const event2: IEvent = {
    type: 'AccountClosed',
    aggregateId: 'aggregateId-1',
    payload: { status: 'closed' },
    timestamp: new Date().getTime(),
  };

  eventStore.save(event2, 1);

  expect((await eventStore.getEvents()).length).toBe(2);
  expect(eventStore.getEventByVersion(0)).toBe(event1);
  expect(eventStore.getEventByVersion(1)).toBe(event2);
  expect((await eventStore.getEventsFromVersion(0)).length).toBe(2);
  expect((await eventStore.getEventsByAggregateId('aggregateId-1')).length).toBe(2);
});
