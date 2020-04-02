import { ICommand } from './interfaces';

export default abstract class Command implements ICommand {
  timestamp: number;
  constructor(public payload: object, public type: string) {
    this.payload = payload;
    this.type = type;
    this.timestamp = new Date().getTime();
  }
}
