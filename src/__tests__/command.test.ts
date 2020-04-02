import Command from '../command';

test('Command', () => {
  class CloseAccountCommand extends Command {
    constructor(payload: object) {
      super(payload, 'CloseAccount');
    }
  }

  const closeAccountCommand = new CloseAccountCommand({ name: 'Carl' });
  expect(closeAccountCommand.payload).toStrictEqual({ name: 'Carl' });
  expect(closeAccountCommand.type).toBe('CloseAccount');
  expect(closeAccountCommand.timestamp).not.toBeLessThan(1);
});
