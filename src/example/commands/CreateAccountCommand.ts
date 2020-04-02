import Command from '../../command';

export default class CreateAccountCommand extends Command {
  constructor(payload: object) {
    super(payload, 'CreateAccount');
  }
}
