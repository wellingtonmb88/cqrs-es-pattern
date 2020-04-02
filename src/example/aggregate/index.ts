import Command from '../../command';
import Aggregate from '../../aggregate';
import { ICommand, IEvent, IEventStoreRepository, IEventBusAdapater } from '../../interfaces';

export default class UserAggregate extends Aggregate {
  status: string = '';

  static createNewInstance(repo: IEventStoreRepository, eventAdapter: IEventBusAdapater): UserAggregate {
    const timestamp = new Date().getTime();
    let instance = new UserAggregate(repo, eventAdapter);
    instance.id = instance.generateUUID();
    instance.version = 0;
    instance.createdAt = timestamp;
    instance.updatedAt = timestamp;
    return instance;
  }

  static getInstance(id: string, repo: IEventStoreRepository, eventAdapter: IEventBusAdapater): UserAggregate {
    const events = repo.getEventsByAggregateId(id);
    let instance = new UserAggregate(repo, eventAdapter);
    let aggregate = instance.reduce(events);
    aggregate.id = id;
    return instance.copy<UserAggregate>(aggregate);
  }

  reduce(events: IEvent[], initialState: UserAggregate = this): UserAggregate {
    return events.reduce<UserAggregate>((acc: UserAggregate, event: IEvent) => {
      const version = event.version || 0;
      switch (event.type) {
        case 'AccountCreated':
          return Object.assign<any, any>(
            {},
            {
              ...acc,
              version,
              status: 'created',
              created_at: event.timestamp,
            },
          );
        case 'AccountClosed':
          return Object.assign<any, any>(
            {},
            {
              ...acc,
              version,
              status: 'closed',
              updated_at: event.timestamp,
            },
          );
        default:
          return acc;
      }
    }, initialState);
  }

  handle(command: ICommand) {
    switch (command.type) {
      case 'CreateAccount':
        this.processCreateAccount(command);
        break;
      case 'CloseAccount':
        this.processCloseAccount(command);
        break;
      default:
        throw new Error('Command not found.');
    }
  }

  publish(event: IEvent) {
    this.eventBusAdapter.publish(`account_${this.id}`, event);
  }

  private processCreateAccount(command: Command) {
    const account = this.reduce(this.repository.getEvents());
    if (account.version! != 0) {
      throw new Error(`User already created`);
    }
    const event: IEvent = {
      type: 'AccountCreated',
      aggregateId: this.id,
      payload: account,
      timestamp: account.createdAt,
    };
    this.repository.save(event, 0);
    this.publish(event);
  }

  private processCloseAccount(command: Command) {
    const account = this.reduce(this.repository.getEvents());
    if (account.status != 'created') {
      throw new Error(`User not created`);
    }

    let event: IEvent = {
      type: 'AccountClosed',
      aggregateId: this.id,
      payload: {},
      timestamp: command.timestamp,
    };

    const version = account.version! + 1;
    event = {
      ...event,
      payload: {
        ...this.reduce([event], account),
        version,
      },
    };
    this.repository.save(event, version);
    this.publish(event);
  }
}
