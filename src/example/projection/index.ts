import Projection from '../../projection';
import { IEvent, IReadModelRepository, IAggregate } from '../../interfaces';

export default class UserProjection extends Projection {
  constructor(repository: IReadModelRepository) {
    super(repository);
  }

  process(event: IEvent): void {
    const aggregate = this.convertEventToAggregate(event);
    switch (event.type) {
      case 'AccountCreated':
        this.repository.save(aggregate);
      case 'AccountClosed':
        this.repository.update(aggregate);
      default:
        return;
    }
  }

  getAll(): IAggregate[] | Promise<IAggregate[]> {
    return this.repository.getAll();
  }

  getById(id: string): IAggregate | Promise<IAggregate> | null {
    return this.repository.getById(id);
  }

  private convertEventToAggregate(event: IEvent): IAggregate {
    return {
      id: event.aggregateId,
      ...event.payload,
    };
  }
}
