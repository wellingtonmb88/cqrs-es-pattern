import IAggregate from './aggregate';
import IEvent from './event';

export default interface IProjection {
  process(event: IEvent): void;
  getAll(): IAggregate[] | Promise<IAggregate[]>;
  getById(id: string): IAggregate | Promise<IAggregate> | undefined;
}
