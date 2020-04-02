import IAggregate from './Aggregate';
import IEvent from './event';

export default interface IReducer {
  reduce(events: IEvent[], initialState?: IAggregate): IAggregate;
}
