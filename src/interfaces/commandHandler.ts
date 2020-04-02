import ICommand from './command';

export default interface ICommandHandler {
  handle(command: ICommand): void;
}
