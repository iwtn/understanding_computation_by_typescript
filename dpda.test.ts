import { Stack } from './stack'
import { PDARule, PDAConfiguration } from './pda'
import { DPDARulebook, DPDA, DPDADesign } from './dpda'

const rulebook = new DPDARulebook([
  new PDARule<string>(1, '(', 2, '$', ['b', '$']),
  new PDARule<string>(2, '(', 2, 'b', ['b', 'b']),
  new PDARule<string>(2, ')', 2, 'b', []),
  new PDARule<string>(2, null, 1, '$', ['$']),
])

test('DPDA', () => {
  const dpda = new DPDA<string>(new PDAConfiguration<string>(1, new Stack(['$'])), [1], rulebook)
  expect(dpda.isAccepting()).toBe(true)

  dpda.readString('(()');
  expect(dpda.isAccepting()).toBe(false)

  const conf2 = dpda.currentConfiguration()
  expect(conf2.state).toBe(2)
  expect(conf2.stack.top()).toBe('b')
})

test('followFreeMoves', () => {
  const conf3 = new PDAConfiguration(2, new Stack(['$']))
  const conf4 = rulebook.followFreeMoves(conf3)

  expect(conf4.state).toBe(1)
  expect(conf4.stack.top()).toBe('$')
})

test('DPDA with followFreeMoves', () => {
  const dpda2 = new DPDA(new PDAConfiguration(1, new Stack(['$'])), [1], rulebook)
  dpda2.readString('(()(');
  expect(dpda2.isAccepting()).toBe(false)

  const conf5 = dpda2.currentConfiguration()
  expect(conf5.state).toBe(2)
  expect(conf5.stack.top()).toBe('b')

  dpda2.readString('))()')
  expect(dpda2.isAccepting()).toBe(true)

  const conf6 = dpda2.currentConfiguration()
  expect(conf6.state).toBe(1)
  expect(conf6.stack.top()).toBe('$')
})

test('DPDA with nextConfiguration', () => {
  const dpda3 = new DPDA(new PDAConfiguration(1, new Stack(['$'])), [1], rulebook)
  dpda3.readString('())')

  expect(dpda3.isAccepting()).toBe(false)
  expect(dpda3.isStuck()).toBe(true)

  const dpdaDesign2 = new DPDADesign<string>(1, '$', [1], rulebook)
  expect(dpdaDesign2.isAccepts('())')).toBe(false)
})

test('DPDADesign', () => {
  const dpdaDesign = new DPDADesign<string>(1, '$', [1], rulebook)
  expect(dpdaDesign.isAccepts('(((((((((())))))))))')).toBe(true)
  expect(dpdaDesign.isAccepts('()(())((()))(()(()))')).toBe(true)
  expect(dpdaDesign.isAccepts('(()(()(()()(()()))()')).toBe(false)
  expect(dpdaDesign.isAccepts('()(())(((()))(()(()))')).toBe(false)
  expect(dpdaDesign.isAccepts('())')).toBe(false)
})

const rulebook2 = new DPDARulebook([
  new PDARule(1, 'a', 2, '$', ['a', '$']),
  new PDARule(1, 'b', 2, '$', ['b', '$']),
  new PDARule(2, 'a', 2, 'a', ['a', 'a']),
  new PDARule(2, 'b', 2, 'b', ['b', 'b']),
  new PDARule(2, 'a', 2, 'b', []),
  new PDARule(2, 'b', 2, 'a', []),
  new PDARule(2, null, 1, '$', ['$'])
])

test('DPDADesign with a and b', () => {
  const dpdaDesign2 = new DPDADesign<string>(1, '$', [1], rulebook2)
  expect(dpdaDesign2.isAccepts('ababab')).toBe(true)
  expect(dpdaDesign2.isAccepts('bbbaaaab')).toBe(true)
  expect(dpdaDesign2.isAccepts('baa')).toBe(false)
})

const rulebook3 = new DPDARulebook([
  new PDARule(1, 'a', 1, '$', ['a', '$']),
  new PDARule(1, 'a', 1, 'a', ['a', 'a']),
  new PDARule(1, 'a', 1, 'b', ['a', 'b']),
  new PDARule(1, 'b', 1, '$', ['b', '$']),
  new PDARule(1, 'b', 1, 'a', ['b', 'a']),
  new PDARule(1, 'b', 1, 'b', ['b', 'b']),
  new PDARule(1, 'm', 2, '$', ['$']),
  new PDARule(1, 'm', 2, 'a', ['a']),
  new PDARule(1, 'm', 2, 'b', ['b']),
  new PDARule(2, 'a', 2, 'a', []),
  new PDARule(2, 'b', 2, 'b', []),
  new PDARule(2, null, 3, '$', ['$'])
])

test('DPDADesign with circular notice', () => {
  const dpdaDesign3 = new DPDADesign<string>(1, '$', [3], rulebook3)
  expect(dpdaDesign3.isAccepts('abmba')).toBe(true)
  expect(dpdaDesign3.isAccepts('babbamabbab')).toBe(true)
  expect(dpdaDesign3.isAccepts('abmb')).toBe(false)
  expect(dpdaDesign3.isAccepts('baambaa')).toBe(false)
})
