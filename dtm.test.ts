import { Tape, TMRule, TMConfiguration, DTMRulebook, DTM } from './dtm';

let tape = new Tape('101', '1', '', '_')

test('Tape inspect', () => {
  expect(tape.inspect()).toBe('101(1)')
})

test('Tape write', () => {
  expect(tape.write('0').inspect()).toBe('101(0)')
})

test('Tape moveHeadLeft', () => {
  expect(tape.moveHeadLeft().inspect()).toBe('10(1)1')

  let tape2 = new Tape('', '1', '011', '_')
  expect(tape2.moveHeadLeft().inspect()).toBe('(_)1011')
})

test('Tape moveHeadRight', () => {
  let tape3 = tape.moveHeadRight()
  expect(tape3.inspect()).toBe('1011(_)')
  expect(tape3.write('0').inspect()).toBe('1011(0)')

  const tape4 = new Tape('1', '1', '00', '_')

  const tape5 = tape4.moveHeadRight()
  expect(tape5.inspect()).toBe('11(0)0')

  const tape6 = tape5.moveHeadRight()
  expect(tape6.inspect()).toBe('110(0)')
})

let rule = new TMRule(1, '0', 2, '1', 'right')

test('TMRule isAppliesTo', () => {
  expect(rule.isAppliesTo(new TMConfiguration(1, new Tape('', '0', '', '_')))).toBe(true)
  expect(rule.isAppliesTo(new TMConfiguration(1, new Tape('', '1', '', '_')))).toBe(false)
  expect(rule.isAppliesTo(new TMConfiguration(2, new Tape('', '0', '', '_')))).toBe(false)
})

test('TMRule follow', () => {
  const ans = rule.follow(new TMConfiguration(1, new Tape('', '0', '', '_')))
  expect(ans.state).toBe(2)
  expect(ans.tape.middle).toBe('_')
})

const rulebook = new DTMRulebook([
  new TMRule(1, '0', 2, '1', 'right'),
  new TMRule(1, '1', 1, '0', 'left'),
  new TMRule(1, '_', 2, '1', 'right'),
  new TMRule(2, '0', 2, '0', 'right'),
  new TMRule(2, '1', 2, '1', 'right'),
  new TMRule(2, '_', 3, '_', 'left'),
])

test('DTMRulebook', () => {
  let tape = new Tape('101', '1', '', '_')
  let configuration = new TMConfiguration(1, tape)

  configuration = rulebook.nextConfiguration(configuration)
  expect(configuration.state).toBe(1)
  expect(configuration.tape.inspect()).toBe('10(1)0')

  configuration = rulebook.nextConfiguration(configuration)
  expect(configuration.state).toBe(1)
  expect(configuration.tape.inspect()).toBe('1(0)00')

  configuration = rulebook.nextConfiguration(configuration)
  expect(configuration.state).toBe(2)
  expect(configuration.tape.inspect()).toBe('11(0)0')
})

test('DTM', () => {
  const tape7 = new Tape('101', '1', '', '_')
  const dtm = new DTM(new TMConfiguration(1, tape7), [3], rulebook)
  expect(dtm.currentConfiguration.state).toBe(1)
  expect(dtm.currentConfiguration.tape.inspect()).toBe('101(1)')

  expect(dtm.isAccepting()).toBe(false)

  dtm.step()
  expect(dtm.currentConfiguration.state).toBe(1)
  expect(dtm.currentConfiguration.tape.inspect()).toBe('10(1)0')
  expect(dtm.isAccepting()).toBe(false)

  dtm.run()
  expect(dtm.currentConfiguration.state).toBe(3)
  expect(dtm.currentConfiguration.tape.inspect()).toBe('110(0)_')
  expect(dtm.isAccepting()).toBe(true)
})
