import { Stack } from './stack';

test('Stack', () => {
  const stack = new Stack<string>(['a', 'b', 'c', 'd', 'e'])
  expect(stack.top()).toBe('a');
  expect(stack.pop().pop().top()).toBe('c');
  expect(stack.push('x').push('y').top()).toBe('y');
  expect(stack.push('x').push('y').pop().top()).toBe('x');
})
