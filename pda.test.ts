import * as Immutable from 'immutable';
import { Stack } from './stack'
import { isSubset, PDARule, PDAConfiguration } from './pda'
import { DPDARulebook } from './dpda'

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

test('PDAConfiguration isSame', () => {
  const conf1 = new PDAConfiguration<string>(1, new Stack(['$']))
  const conf2 = new PDAConfiguration<string>(1, new Stack(['b', '$']))
  const conf3 = new PDAConfiguration<string>(2, new Stack(['$']))
  const conf4 = new PDAConfiguration<string>(2, new Stack([]))
  const conf5 = new PDAConfiguration<string>(1, new Stack(['$']))

  expect(conf1.isSame(conf2)).toBe(false)
  expect(conf1.isSame(conf3)).toBe(false)
  expect(conf1.isSame(conf4)).toBe(false)
  expect(conf1.isSame(conf5)).toBe(true)
})

test('isSubset', () => {
  const conf1 = new PDAConfiguration<string>(1, new Stack(['$']))
  const conf2 = new PDAConfiguration<string>(1, new Stack(['b', '$']))
  const conf5 = new PDAConfiguration<string>(1, new Stack(['$']))

  expect(isSubset([], [])).toBe(true)
  expect(isSubset([conf1], [])).toBe(true)
  expect(isSubset([conf5], [conf1])).toBe(true)
  expect(isSubset([conf5, conf2], [conf1])).toBe(true)

  expect(isSubset([], [conf1])).toBe(false)
  expect(isSubset([conf2], [conf1])).toBe(false)
  expect(isSubset([conf5], [conf1, conf2])).toBe(false)
})
