import * as Immutable from 'immutable';
import { NFARulebook, FARule, NFA, NFADesign } from './nfa';

const rulebook: NFARulebook = new NFARulebook([
   new FARule(1, 'a', 1),
   new FARule(1, 'b', 1),
   new FARule(1, 'b', 2),
   new FARule(2, 'a', 3),
   new FARule(2, 'b', 3),
   new FARule(3, 'a', 4),
   new FARule(3, 'b', 4)
])

test('NFARulebook', () => {
  expect(rulebook.nextStates(Immutable.Set([1]), 'b')).toStrictEqual(Immutable.Set([1, 2]));
  expect(rulebook.nextStates(Immutable.Set([1, 2]), 'a')).toStrictEqual(Immutable.Set([1, 3]));
  expect(rulebook.nextStates(Immutable.Set([1, 3]), 'b')).toStrictEqual(Immutable.Set([1, 2, 4]));
})

test('NFA.readCharacter', () => {
  const nfa = new NFA(Immutable.Set([1]), Immutable.Set([4]), rulebook)
  expect(nfa.isAccepting()).toBe(false);

  nfa.readCharacter('b')
  expect(nfa.isAccepting()).toBe(false);

  nfa.readCharacter('a')
  expect(nfa.isAccepting()).toBe(false);

  nfa.readCharacter('b')
  expect(nfa.isAccepting()).toBe(true);
})

test('NFA.readString', () => {
  const nfa = new NFA(Immutable.Set([1]), Immutable.Set([4]), rulebook)
  nfa.readString('bbbbb')
  expect(nfa.isAccepting()).toBe(true);
})

test('NFADesign', () => {
  const nfaDesign = new NFADesign(1, Immutable.Set([4]), rulebook)
  expect(nfaDesign.isAccepts('bab')).toBe(true);
  expect(nfaDesign.isAccepts('bbbbb')).toBe(true);
  expect(nfaDesign.isAccepts('bbabb')).toBe(false);
})

const rulebookWithFree = new NFARulebook([
  new FARule(1, null, 2),
  new FARule(2, 'a',  3),
  new FARule(3, 'a',  2),
  new FARule(4, 'a',  5),
  new FARule(5, 'a',  6),
  new FARule(6, 'a',  4),
  new FARule(1, null, 4)
])

test('NFADesign with Free Move', () => {
  const nfaDesign = new NFADesign(1, Immutable.Set([2, 4]), rulebookWithFree)
  expect(nfaDesign.isAccepts('aa')).toBe(true);
  expect(nfaDesign.isAccepts('aaa')).toBe(true);
  expect(nfaDesign.isAccepts('aaaaa')).toBe(false);
  expect(nfaDesign.isAccepts('aaaaaa')).toBe(true);
  expect(nfaDesign.isAccepts('aaaaaaa')).toBe(false);
})
