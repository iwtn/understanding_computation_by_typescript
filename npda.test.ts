import * as Immutable from 'immutable';
import { Stack } from './stack'
import { PDARule, PDAConfiguration } from './pda'
import { NPDARulebook, NPDA } from './npda'

const rulebook = new NPDARulebook([
  new PDARule(1, 'a', 1, '$', ['a', '$']),
  new PDARule(1, 'a', 1, 'a', ['a', 'a']),
  new PDARule(1, 'a', 1, 'b', ['a', 'b']),
  new PDARule(1, 'b', 1, '$', ['b', '$']),
  new PDARule(1, 'b', 1, 'a', ['b', 'a']),
  new PDARule(1, 'b', 1, 'b', ['b', 'b']),
  new PDARule(1, null, 2, '$', ['$']),
  new PDARule(1, null, 2, 'a', ['a']),
  new PDARule(1, null, 2, 'b', ['b']),
  new PDARule(2, 'a', 2, 'a', []),
  new PDARule(2, 'b', 2, 'b', []),
  new PDARule(2, null, 3, '$', ['$'])
])

test('NPDA', () => {
  const configuration = new PDAConfiguration<string>(1, new Stack(['$']))
  const npda = new NPDA<string>(Immutable.Set([configuration]), Immutable.Set([3]), rulebook)

  expect(npda.isAccepting()).toBe(true)
  expect(npda.getCurrentConfigrations()).toStrictEqual(Immutable.Set([
    new PDAConfiguration<string>(1, new Stack(['$'])),
    new PDAConfiguration<string>(2, new Stack(['$'])),
    new PDAConfiguration<string>(3, new Stack(['$']))
  ]))

  npda.readString('a')
  expect(npda.isAccepting()).toBe(false)
  for(const conf of npda.getCurrentConfigrations()) {
    console.log(conf)
  }
  expect(npda.getCurrentConfigrations()).toStrictEqual(Immutable.Set([
    new PDAConfiguration<string>(1, new Stack(['a', '$'])),
    new PDAConfiguration<string>(2, new Stack(['a', '$'])),
  ]))

  npda.readString('abb')
  expect(npda.isAccepting()).toBe(false)
  expect(npda.getCurrentConfigrations()).toStrictEqual(Immutable.Set([
    new PDAConfiguration<string>(1, new Stack(['b', 'a', '$'])),
    new PDAConfiguration<string>(2, new Stack(['b', 'a', '$'])),
  ]))

  npda.readString('a')
  expect(npda.isAccepting()).toBe(true)
  expect(npda.getCurrentConfigrations()).toStrictEqual(Immutable.Set([
    new PDAConfiguration<string>(1, new Stack(['b', 'a', '$'])),
    new PDAConfiguration<string>(2, new Stack(['b', 'a', '$'])),
  ]))
})
