import { IProjection, IEvent, IAggregate, IReadModelRepository } from './interfaces';

export default abstract class Projection implements IProjection {
  repository: IReadModelRepository;
  constructor(repository: IReadModelRepository) {
    this.repository = repository;
  }

  abstract process(event: IEvent): void;
  abstract getAll(): IAggregate[] | Promise<IAggregate[]>;
  abstract getById(id: string): IAggregate | Promise<IAggregate> | null;
}
