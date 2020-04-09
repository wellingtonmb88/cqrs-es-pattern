import Command from '../../command';
import Aggregate from '../../aggregate';
import { ICommand, IEvent, IEventStoreRepository, IEventBusAdapater } from '../../interfaces';

export default class UserAggregate extends Aggregate {
  status: string = '';

  static createNewInstance(repo: IEventStoreRepository, eventAdapter: IEventBusAdapater): UserAggregate {
    let instance = new UserAggregate(repo, eventAdapter);
    instance.id = instance.generateUUID();
    return instance;
  }

  static async getInstance(id: string, repo: IEventStoreRepository, eventAdapter: IEventBusAdapater): Promise<UserAggregate> {
    const events = await repo.getEventsByAggregateId(id);
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
              updated_at: event.timestamp,
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

  async handle(command: ICommand) {
    switch (command.type) {
      case 'CreateAccount':
        await this.processCreateAccount(command);
        break;
      case 'CloseAccount':
        await this.processCloseAccount(command);
        break;
      default:
        throw new Error('Command not found.');
    }
  }

  publish(event: IEvent) {
    this.eventBusAdapter.publish(`account_${this.id}`, event);
  }

  private async processCreateAccount(command: Command) {
    const account = this.reduce(await this.repository.getEvents());
    if (account.version && account.version != 0) {
      throw new Error(`User already created`);
    }
    const event = this.createEvent(command, 'AccountCreated', 0, account)
    this.repository.save(event, 0);
    this.publish(event);
  }

  private async processCloseAccount(command: Command) {
    const account = this.reduce(await this.repository.getEvents());
    if (account.status != 'created') {
      throw new Error(`User not created`);
    }

    const version = account.version! + 1;
    const event = this.createEvent(command, 'AccountClosed', version, account)
    this.repository.save(event, version);
    this.publish(event);
  }
}
