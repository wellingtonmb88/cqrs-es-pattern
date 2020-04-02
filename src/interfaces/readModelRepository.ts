import IAggregate from './aggregate';

export default interface IReadModelRepository {
  save(aggregate: IAggregate): void;
  update(aggregate: IAggregate): void;
  getAll(): IAggregate[];
  getById(id: string): IAggregate | undefined;
  getByVersion(version: number): IAggregate;
}
