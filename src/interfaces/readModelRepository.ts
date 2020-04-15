import IAggregate from './aggregate';

export default interface IReadModelRepository {
  save(aggregate: IAggregate): void;
  update(aggregate: IAggregate): void;
  getAll(): IAggregate[] | Promise<IAggregate[]>;
  getById(id: string): IAggregate | null | Promise<IAggregate | null>;
  getByVersion(version: number): IAggregate | null | Promise<IAggregate | null>;
}
