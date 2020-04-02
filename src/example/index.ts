import EventStore from './eventstore';
import UserAggregate from './aggregate';
import CreateAccountCommand from './commands/CreateAccountCommand';
import CloseAccountCommand from './commands/CloseAccountCommand';
import EventBusAdapater from './eventbusadapter';
import UserProjection from './projection';
import ReadModel from './readmodel';
import { IProjector, IEvent } from '../interfaces';

(async () => {
  //################# QUERY #########################
  const readModel = new ReadModel();
  const userProjection = new UserProjection(readModel);

  const userProjector = new (class UserProjector implements IProjector {
    receive(event: IEvent): void {
      userProjection.process(event);
    }
  })();
  //#################  #########################

  //################# COMMAND #########################
  const eventAdapter = EventBusAdapater.getInstance();
  const eventStore = new EventStore();
  const userAggregate = UserAggregate.createNewInstance(eventStore, eventAdapter);
  await new Promise((r) => setTimeout(r, 500));

  const createAccountCommand = new CreateAccountCommand({});
  await new Promise((r) => setTimeout(r, 500));

  eventAdapter.subscribe(`account_${userAggregate.id}`, userProjector);

  userAggregate.handle(createAccountCommand);
  //#################  #########################

  //################# QUERY #########################
  console.log(userProjection.getAll());
  //#################  #########################

  //################# COMMAND #########################
  const currentUserAggregate = UserAggregate.getInstance(userAggregate.id!, eventStore, eventAdapter);

  const closeAccountCommand = new CloseAccountCommand({ status: 'closed' });
  await new Promise((r) => setTimeout(r, 500));
  currentUserAggregate.handle(closeAccountCommand);

  //#################  #########################

  //################# QUERY #########################
  console.log(userProjection.getAll());
  //#################  #########################
})();
