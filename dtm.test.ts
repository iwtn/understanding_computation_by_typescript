import { Tape } from './dtm';

test('Tape inspect', () => {
  const tape = new Tape('101', '1', '', '_')
  expect(tape.inspect()).toBe('101(1)')
})

test('Tape write', () => {
  const tape2 = new Tape('101', '1', '', '_')
  expect(tape2.write('0').inspect()).toBe('101(0)')
})

test('Tape moveHeadLeft', () => {
  const tape3 = new Tape('101', '1', '', '_')
  expect(tape3.moveHeadLeft().inspect()).toBe('10(1)1')

  const tape4 = new Tape('', '1', '011', '_')
  expect(tape4.moveHeadLeft().inspect()).toBe('(_)1011')
})
