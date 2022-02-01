import { DFARulebook, FARule } from './dfa';

const rulebook = new DFARulebook([
  new FARule(1, 'a', 2),
  new FARule(1, 'b', 1),
  new FARule(2, 'a', 2),
  new FARule(2, 'b', 3),
  new FARule(3, 'a', 3),
  new FARule(3, 'b', 3)
])

test('DFARulebook', () => {
  expect(rulebook.nextState(1, 'a')).toBe(2);
  expect(rulebook.nextState(1, 'b')).toBe(1);
  expect(rulebook.nextState(2, 'b')).toBe(3);
});
