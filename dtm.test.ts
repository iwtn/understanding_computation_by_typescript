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

test('DTM with an error', () => {
  const tape8 = new Tape('121', '1', '', '_')
  const dtm2 = new DTM(new TMConfiguration(1, tape8), [3], rulebook)
  dtm2.run()

  expect(dtm2.currentConfiguration.state).toBe(1)
  expect(dtm2.currentConfiguration.tape.inspect()).toBe('1(2)00')
  expect(dtm2.isAccepting()).toBe(false)
  expect(dtm2.isStuck()).toBe(true)
})

const rulebook2 = new DTMRulebook([
  // 状態1: aを探して右にスキャンする
  new TMRule(1, 'X', 1, 'X', 'right'), // Xをスキップする
  new TMRule(1, 'a', 2, 'X', 'right'), // aを消して、状態2に進む
  new TMRule(1, '_', 6, '_', 'left'), // 空白を見つけて、状態6(受理状態)に進む

  // 状態2: bを探して右にスキャンする
  new TMRule(2, 'a', 2, 'a', 'right'), // aをスキップする
  new TMRule(2, 'X', 2, 'X', 'right'), // Xをスキップする
  new TMRule(2, 'b', 3, 'X', 'right'), // bを消して、状態3に進む

  // 状態3: cを探して右にスキャンする
  new TMRule(3, 'b', 3, 'b', 'right'), // bをスキップする
  new TMRule(3, 'X', 3, 'X', 'right'), // Xをスキップする
  new TMRule(3, 'c', 4, 'X', 'right'), // cを消して、状態4に進む

  // 状態4: 文字列の末尾を探して右にスキャンする
  new TMRule(4, 'c', 4, 'c', 'right'), // cをスキップする
  new TMRule(4, '_', 5, '_', 'left'), // 空白を見つけて、状態5に進む

  // 状態5: 文字列の先頭を探して左にスキャンする
  new TMRule(5, 'a', 5, 'a', 'left'), // aをスキップする
  new TMRule(5, 'b', 5, 'b', 'left'), // bをスキップする
  new TMRule(5, 'c', 5, 'c', 'left'), // cをスキップする
  new TMRule(5, 'X', 5, 'X', 'left'), // Xをスキップする
  new TMRule(5, '_', 1, '_', 'right') // 空白を見つけて、状態1に進む
])

const tape9 = new Tape('', 'a', 'aabbbccc', '_')
const dtm3 = new DTM(new TMConfiguration(1, tape9), [6], rulebook2)

test('DTM sample', () => {
  for(let i = 0; i < 10; i++) {
    dtm3.step()
  }
  expect(dtm3.currentConfiguration.state).toBe(5)
  expect(dtm3.currentConfiguration.tape.inspect()).toBe('XaaXbbXc(c)_')

  for(let i = 0; i < 25; i++) {
    dtm3.step()
  }
  expect(dtm3.currentConfiguration.state).toBe(5)
  expect(dtm3.currentConfiguration.tape.inspect()).toBe('_XXa(X)XbXXc_')

  dtm3.run()
  expect(dtm3.currentConfiguration.state).toBe(6)
  expect(dtm3.currentConfiguration.tape.inspect()).toBe('_XXXXXXXX(X)_')

  expect(dtm3.isAccepting()).toBe(true)
  expect(dtm3.isStuck()).toBe(false)
})
