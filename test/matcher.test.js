const matcher = require('../src/matcher');

test('returns substrings enclosed by curly braces', () => {
  expect(matcher('Hello, {world}!')[0]).toBe('world');
});

test('only returns each instance of an identical substring once', () => {
  expect(matcher('{1} {1}').length).toBe(1);
});
