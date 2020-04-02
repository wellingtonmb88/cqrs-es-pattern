export default interface IEvent {
  id?: string | undefined;
  aggregateId: string | undefined;
  type: string | undefined;
  payload: object | undefined;
  version?: number | undefined;
  timestamp: number | undefined;
}
