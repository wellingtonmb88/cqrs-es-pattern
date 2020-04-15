import { IAggregate, IReadModelRepository } from '../../interfaces';

export default class ReadModel implements IReadModelRepository {
  private db: IAggregate[] = [];

  save(aggregate: IAggregate): void {
    this.db.push(aggregate);
  }

  update(aggregate: IAggregate): void {
    this.db = this.db.map((a) => {
      if (a.id === aggregate.id) {
        return {
          ...a,
          ...aggregate,
        };
      }
      return a;
    });
  }

  getAll(): IAggregate[] {
    return this.db;
  }

  getById(id: string): IAggregate | null {
    return this.db.find((a) => a.id === id) || null;
  }

  getByVersion(version: number): IAggregate {
    throw new Error('Method not implemented.');
  }
}
