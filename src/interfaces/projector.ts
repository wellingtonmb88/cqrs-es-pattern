import { IEvent } from '.';

export default interface IProjector {
  receive(event: IEvent): void;
}
