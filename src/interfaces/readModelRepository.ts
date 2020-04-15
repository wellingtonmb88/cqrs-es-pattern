import IAggregate from './aggregate';

export default interface IReadModelRepository {
  save(aggregate: IAggregate): void;
  update(aggregate: IAggregate): void;
  getAll(): IAggregate[] | Promise<IAggregate[]>;
  getById(id: string): IAggregate | Promise<IAggregate> | undefined;
  getByVersion(version: number): IAggregate | Promise<IAggregate> | undefined;
}
