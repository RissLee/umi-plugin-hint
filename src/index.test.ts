import { checkVersionNotify } from '.';

it('test prettier updater', () => {
  expect(checkVersionNotify('prettier')).toBe(undefined);
});

it('test wrong pkg name throw Error', () => {
  expect(() => checkVersionNotify('wrong-www')).toThrow();
});
