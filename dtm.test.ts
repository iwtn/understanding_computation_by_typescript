import { Tape } from './dtm';

test('Tape#inspect', () => {
  const tape = new Tape('101', '1', '')
  expect(tape.inspect()).toBe('101(1)')
})
