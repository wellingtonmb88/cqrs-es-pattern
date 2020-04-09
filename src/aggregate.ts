import {
  ICommand,
  IEvent,
  IAggregate,
  IReducer,
  ICommandHandler,
  IEventStoreRepository,
  IEventBusAdapater,
} from './interfaces';

import { v4 as uuidv4 } from 'uuid';

export default abstract class Aggregate implements IAggregate, ICommandHandler, IReducer {
  id?: string;
  version?: number;
  createdAt?: number;
  updatedAt?: number;
  repository: IEventStoreRepository;
  eventBusAdapter: IEventBusAdapater;

  constructor(repo: IEventStoreRepository, eventAdapter: IEventBusAdapater) {
    this.repository = repo;
    this.eventBusAdapter = eventAdapter;
  }

  public generateUUID(): string {
    return uuidv4();
  }

  public copy<T extends Aggregate>(origin: T): T {
    const target: any = this;
    const o: any = origin;
    Object.keys(origin).forEach((key) => {
      if (!target.hasOwnProperty(key)) {
        target[key] = o[key];
      }
    });
    return target;
  }

  public createPayload(state: IAggregate): any {
    return {
      ...state,
      repository: undefined,
      eventBusAdapter: undefined,
    };
  }

  public createEvent(command: ICommand, type: string, version: number, initialState?: IAggregate): IEvent {
    const event: IEvent = {
      type,
      aggregateId: this.id,
      payload: {},
      timestamp: command.timestamp,
    };

    return {
      ...event,
      payload: {
        ...this.createPayload(this.reduce([event], initialState)),
        version,
      },
    };
  }

  abstract reduce(events: IEvent[], initialState?: IAggregate): IAggregate;
  abstract handle(command: ICommand): void;
  abstract publish(event: IEvent): void;
}
