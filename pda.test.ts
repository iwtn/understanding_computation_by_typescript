import { Stack } from './stack'
import { PDARule, PDAConfiguration } from './pda'

test('PDARule', () =>{
  const rule = new PDARule(1, '(', 2, '$', ['b', '$'])
  const configuration = new PDAConfiguration<string>(1, new Stack(['$']))

  expect(rule.appliesTo(configuration, '(')).toBe(true)
  expect(rule.appliesTo(configuration, ')')).toBe(false)
})
