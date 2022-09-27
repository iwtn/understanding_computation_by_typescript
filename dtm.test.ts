import { Tape } from './dtm';

test('Tape#inspect', () => {
  const tape = new Tape('101', '1', '')
  expect(tape.inspect()).toBe('101(1)')
})

test('Tape#write', () => {
  const tape2 = new Tape('101', '1', '')
  expect(tape2.write('0').inspect()).toBe('101(0)')
})
