import IAggregate from './aggregate';
import IEvent from './event';

export default interface IProjection {
  process(event: IEvent): void;
  getAll(): IAggregate[];
  getById(id: string): IAggregate | undefined;
}
