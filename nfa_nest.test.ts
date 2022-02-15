import * as Immutable from 'immutable';
import { FARule } from './farule';
import { NFARulebook, NFADesign } from './nfa';

const rulebook = new NFARulebook([
  new FARule(0, '(', 1),
  new FARule(1, ')', 0),
  new FARule(1, '(', 2),
  new FARule(2, ')', 1),
  new FARule(2, '(', 3),
  new FARule(3, ')', 2)
])

test('NFARulebook', () => {
  const nfaDesign = new NFADesign(0, Immutable.Set([0]), rulebook)

  expect(nfaDesign.isAccepts('(()')).toBe(false);
  expect(nfaDesign.isAccepts('())')).toBe(false);
  expect(nfaDesign.isAccepts('(())')).toBe(true);
  expect(nfaDesign.isAccepts('(()(()()))')).toBe(true);

  // not good for nfa
  expect(nfaDesign.isAccepts('(((())))')).toBe(false);
})
