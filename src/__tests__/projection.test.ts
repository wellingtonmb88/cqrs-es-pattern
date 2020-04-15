import UserProjection from '../example/projection';
import ReadModel from '../example/readmodel';
import { IEvent } from '../interfaces';

test('Projection', async () => {
  const readModel = new ReadModel();
  const userProjection = new UserProjection(readModel);
  const allUsers = await userProjection.getAll();
  expect(allUsers.length).toBe(0);

  const event1: IEvent = {
    type: 'AccountCreated',
    aggregateId: 'aggregateId-1',
    payload: { status: 'created' },
    timestamp: new Date().getTime(),
  };

  userProjection.process(event1);

  expect(userProjection.getAll()).toStrictEqual([{ id: 'aggregateId-1', status: 'created' }]);

  const event2: IEvent = {
    type: 'AccountClosed',
    aggregateId: 'aggregateId-1',
    payload: { status: 'closed' },
    timestamp: new Date().getTime(),
  };

  userProjection.process(event2);

  expect(userProjection.getById('aggregateId-1')).toStrictEqual({ id: 'aggregateId-1', status: 'closed' });
});
