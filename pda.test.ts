import { Stack } from './stack'
import { PDARule, PDAConfiguration, DPDARulebook, DPDA, DPDADesign } from './pda'

test('PDARule', () => {
  const rule = new PDARule<string>(1, '(', 2, '$', ['b', '$'])
  const configuration = new PDAConfiguration<string>(1, new Stack(['$']))

  expect(rule.appliesTo(configuration, '(')).toBe(true)
  expect(rule.appliesTo(configuration, ')')).toBe(false)
})


const rulebook = new DPDARulebook([
  new PDARule<string>(1, '(', 2, '$', ['b', '$']),
  new PDARule<string>(2, '(', 2, 'b', ['b', 'b']),
  new PDARule<string>(2, ')', 2, 'b', []),
  new PDARule<string>(2, null, 1, '$', ['$']),
])

test('PDAConfiguration', () => {
  const conf = new PDAConfiguration<string>(1, new Stack(['$']))

  const conf2 = rulebook.nextConfiguration(conf, '(')
  expect(conf2.stack.top()).toBe('b')

  const conf3 = rulebook.nextConfiguration(conf2, '(')
  expect(conf3.stack.top()).toBe('b')

  const conf4 = rulebook.nextConfiguration(conf3, ')')
  expect(conf4.stack.top()).toBe('b')
})

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

test('DPDADesign', () => {
  const dpdaDesign = new DPDADesign<string>(1, '$', [1], rulebook)
  expect(dpdaDesign.isAccepts('(((((((((())))))))))')).toBe(true)
  expect(dpdaDesign.isAccepts('()(())((()))(()(()))')).toBe(true)
  expect(dpdaDesign.isAccepts('(()(()(()()(()()))()')).toBe(false)
  expect(dpdaDesign.isAccepts('()(())(((()))(()(()))')).toBe(false)
})
