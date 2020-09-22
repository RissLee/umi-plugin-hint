import { checkVersionNotify } from '.';

it('test prettier updater', () => {
  expect(checkVersionNotify({ name: 'prettier', version: '0.0.1' })).toBe(
    undefined,
  );
});
