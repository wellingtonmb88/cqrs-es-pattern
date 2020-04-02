import Command from '../../command';

export default class CloseAccountCommand extends Command {
  constructor(payload: object) {
    super(payload, 'CloseAccount');
  }
}
