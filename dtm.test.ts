import { Tape } from './dtm';

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
})
