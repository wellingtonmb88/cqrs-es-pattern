export default interface ICommand {
  type: string;
  payload: object;
  timestamp: number;
}
