import * as Immutable from 'immutable';
import { FARule } from './farule';
import { DFARulebook, DFA, DFADesign } from './dfa';

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

test('DFA.readCharacter', () => {
  const dfa = new DFA(1, Immutable.Set([3]), rulebook)
  expect(dfa.isAccepting()).toBe(false);

  dfa.readCharacter('b')
  expect(dfa.isAccepting()).toBe(false);

  dfa.readCharacter('a')
  dfa.readCharacter('a')
  dfa.readCharacter('a')
  expect(dfa.isAccepting()).toBe(false);

  dfa.readCharacter('b')
  expect(dfa.isAccepting()).toBe(true);
});

test('DFA.readString', () => {
  const dfa = new DFA(1, Immutable.Set([3]), rulebook)
  dfa.readString('baaab')
  expect(dfa.isAccepting()).toBe(true);
});

test('DFADesign', () => {
  const dd = new DFADesign(1, Immutable.Set([3]), rulebook)
  expect(dd.isAccepts('a')).toBe(false);
  expect(dd.isAccepts('baa')).toBe(false);
  expect(dd.isAccepts('baba')).toBe(true);
});
