import EventBusAdapater from '../example/eventbusadapter';
import { IEvent, IObserver } from '../interfaces';

test('EventBusAdapater', async () => {
  const eventAccountCreated: IEvent = {
    type: 'AccountCreated',
    aggregateId: 'aggregateId-1',
    payload: { status: 'created' },
    timestamp: new Date().getTime(),
  };

  class Observer implements IObserver {
    receive(event: IEvent): void {
      expect(event).toStrictEqual(eventAccountCreated);
    }
  }

  const observer = new Observer();
  const eventBusAdapater = EventBusAdapater.getInstance();
  eventBusAdapater.subscribe('queue-1', observer);
  eventBusAdapater.publish('queue-1', eventAccountCreated);
  eventBusAdapater.unsubscribe('queue-1', observer);
});
